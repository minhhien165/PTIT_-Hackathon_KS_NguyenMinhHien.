import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type ParamTypes = {
  params: {
    id: string;
  };
};

// Lấy danh sách tất cả nhân viên
export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const data = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(data);
    return NextResponse.json({ data: employees });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

// Lấy thông tin chi tiết một nhân viên theo ID
export async function GET_EMPLOYEE(request: Request, { params }: ParamTypes) {
  try {
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const data = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(data);
    const result = employees.find((item: any) => item.id === +params.id);
    if (!result) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee data' }, { status: 500 });
  }
}

// Cập nhật thông tin nhân viên theo ID
export async function PATCH(request: Request, { params }: ParamTypes) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const employeesData = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(employeesData);

    const employeeIndex = employees.findIndex((employee: any) => employee.id === +params.id);
    if (employeeIndex === -1) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Validate email uniqueness
    if (employees.some((employee: any) => employee.email === data.email && employee.id !== +params.id)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    employees[employeeIndex] = { ...employees[employeeIndex], ...data };
    await fs.writeFile(filePath, JSON.stringify(employees, null, 2));

    return NextResponse.json({
      message: 'Employee updated successfully',
      data: employees[employeeIndex],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// Xóa thông tin nhân viên theo ID
export async function DELETE(request: Request, { params }: ParamTypes) {
  try {
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const data = await fs.readFile(filePath, 'utf8');
    let employees = JSON.parse(data);

    const employeeIndex = employees.findIndex((employee: any) => employee.id === +params.id);
    if (employeeIndex === -1) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    employees = employees.filter((employee: any) => employee.id !== +params.id);
    await fs.writeFile(filePath, JSON.stringify(employees, null, 2));

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}

// Thêm mới nhân viên
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const employeesData = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(employeesData);

    // Validate email uniqueness
    if (employees.some((employee: any) => employee.email === data.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newId = employees.length
      ? Math.max(...employees.map((employee: any) => employee.id)) + 1
      : 1;
    const newEmployee = { id: newId, ...data };

    employees.push(newEmployee);
    await fs.writeFile(filePath, JSON.stringify(employees, null, 2));

    return NextResponse.json({
      message: 'Employee added successfully',
      data: newEmployee,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}

// Tìm kiếm nhân viên theo tên
export async function SEARCH(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'dataBase/employees.json');
    const data = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(data);

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ message: 'Please provide a name to search' }, { status: 400 });
    }

    const filteredEmployees = employees.filter((employee: any) =>
      employee.employeeName.toLowerCase().includes(name.toLowerCase())
    );

    // Ensure we return an array
    return NextResponse.json(filteredEmployees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search employees' }, { status: 500 });
  }
}

