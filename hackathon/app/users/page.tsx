"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    employeeName: '',
    dateOfBirth: '',
    image: '',
    email: ''
  });
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error('Fetched data is not an array');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      setNewEmployee({ employeeName: '', dateOfBirth: '', image: '', email: '' });
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmployee) {
      try {
        const res = await fetch(`http://localhost:3000/api/employees/${editEmployee.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editEmployee),
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        setEditEmployee(null);
        setShowEditModal(false);
        fetchEmployees();
      } catch (error) {
        console.error('Error editing employee:', error);
      }
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/search?email=${searchEmail}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error('Search result is not an array');
      }
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button onClick={() => setShowAddModal(true)}>Add Employee</Button>
        <Form className="d-flex">
          <Form.Group controlId="formSearch">
            <Form.Control
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="me-2"
            />
          </Form.Group>
          <Button onClick={handleSearch}>Search</Button>
        </Form>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Image</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.dateOfBirth}</td>
              <td>
                <img
                  src={employee.image}
                  alt={employee.employeeName}
                  style={{ width: '100px', height: 'auto', borderRadius: '4px' }} // Thay đổi kích thước hình ảnh theo yêu cầu
                />
              </td>
              <td>{employee.email}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setEditEmployee(employee);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>


      {/* Add Employee Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEmployee}>
            <Form.Group controlId="formEmployeeName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newEmployee.employeeName}
                onChange={e => setNewEmployee({ ...newEmployee, employeeName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={newEmployee.dateOfBirth}
                onChange={e => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={newEmployee.image}
                onChange={e => setNewEmployee({ ...newEmployee, image: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmployee.email}
                onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEmployee && (
            <Form onSubmit={handleEditEmployee}>
              <Form.Group controlId="formEmployeeName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.employeeName}
                  onChange={e => setEditEmployee({ ...editEmployee, employeeName: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={editEmployee.dateOfBirth}
                  onChange={e => setEditEmployee({ ...editEmployee, dateOfBirth: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.image}
                  onChange={e => setEditEmployee({ ...editEmployee, image: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editEmployee.email}
                  onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeList;
