
export type UserRole = 'Admin' | 'HOD' | 'Teacher' | 'Student';

export interface User {
    id: number;
    email: string;
    // In a real app, this would be a hashed password.
    // This is for client-side simulation only.
    password: string; 
    name: string;
    role: UserRole;
    department?: string; // For HOD role
    teacherId?: number;  // For Teacher role
}

export interface Teacher {
    id: number;
    name: string;
    subjects: string[];
}

export interface TimetableSlot {
    class: string;
    subject: string;
    teacher: string | null;
    isSubstitute?: boolean;
    originalTeacher?: string;
}

export interface TimetableData {
    [day: string]: TimetableSlot[];
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
}
