import { User } from '../types';

export const mockUsers: User[] = [
    {
        id: 101,
        email: 'admin@school.edu',
        password: 'admin',
        name: 'Dr. Evelyn Reed',
        role: 'Admin',
    },
    {
        id: 201,
        email: 'hod.math@school.edu',
        password: 'password',
        name: 'Mrs. Angela Martin',
        role: 'HOD',
        department: 'Mathematics',
    },
    {
        id: 202,
        email: 'hod.science@school.edu',
        password: 'password',
        name: 'Mr. Stanley Hudson',
        role: 'HOD',
        department: 'Science',
    },
    {
        id: 1, // Must match teacher ID from mockData
        email: 'jsmith@school.edu',
        password: 'password',
        name: 'Mr. John Smith',
        role: 'Teacher',
        teacherId: 1,
    },
    {
        id: 7, // Must match teacher ID from mockData
        email: 'rtaylor@school.edu',
        password: 'password',
        name: 'Mr. Robert Taylor',
        role: 'Teacher',
        teacherId: 7,
    },
    {
        id: 901,
        email: 'student@school.edu',
        password: 'password',
        name: 'Alex Johnson',
        role: 'Student',
    },
];
