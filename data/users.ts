
import { User } from '../types';

export const mockUsers: User[] = [
    {
        id: 1,
        email: 'admin@sode-edu.in',
        password: 'admin',
        name: 'Dr.Bharathi',
        role: 'Admin',
    },
    {
        id: 2,
        email: 'hod.cs@sode-edu.in',
        password: 'password',
        name: 'Mrs. Sahana',
        role: 'HOD',
        department: 'CSE',
    },
    {
        id: 3,
        email: 'hod.cn@sode-edu.in',
        password: 'password',
        name: 'Mr. Deepak Rao',
        role: 'HOD',
        department: 'CSE',
    },
    {
        id: 4,
        email: 'kuthyarjava@sode-edu.in',
        password: 'password',
        name: 'Mr. Kuthyar',
        role: 'Teacher',
        teacherId: 1,
    },
    {
        id: 5,
        email: 'sachidananda@sode-edu.in',
        password: 'password',
        name: 'Sachidananda',
        role: 'Student',
    },
];
