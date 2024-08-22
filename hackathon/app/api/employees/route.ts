import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), 'dataBase', 'employees.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(data);
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Lỗi khi đọc file:', error);
    return NextResponse.json({ message: 'Lỗi khi đọc file' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { employeeName, dateOfBirth, image, email } = await request.json();
  const filePath = path.join(process.cwd(), 'dataBase', 'employees.json');

  if (!employeeName || !dateOfBirth || !image || !email) {
    return NextResponse.json({ message: 'Thiếu trường bắt buộc' }, { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const employees = JSON.parse(data);
    const newEmployee = {
      id: employees.length ? employees[employees.length - 1].id + 1 : 1,
      employeeName,
      dateOfBirth,
      image,
      email,
    };

    employees.push(newEmployee);
    await fs.writeFile(filePath, JSON.stringify(employees, null, 2));
    console.log(request.method); // Ví dụ: Sử dụng request
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi lưu file:', error);
    return NextResponse.json({ message: 'Lỗi khi lưu file' }, { status: 500 });
  }
}
