import { GoogleGenAI, Type } from '@google/genai';
import type { Teacher, TimetableData, User, AbsenceRequest } from '../types';
import { 
    initialTimetableData, 
    initialTeachers, 
    uniqueSubjects, 
    daysOfWeek, 
    periods,
    subjectToDepartment,
    departmentHODs,
    initialAbsenceRequests
} from '../data/mockData';
import { mockUsers } from '../data/users';

// Fix: Switched from import.meta.env.VITE_GEMINI_API_KEY to process.env.API_KEY to adhere to the coding guidelines.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error(
    "API_KEY is not defined. Please ensure the API_KEY environment variable is set."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- In-memory DB simulation ---
let absenceRequests: AbsenceRequest[] = initialAbsenceRequests;
let nextAbsenceId = 1;

// --- API Simulation Layer ---
const SIMULATED_DELAY = 300; // ms

export const apiGetInitialData = async (): Promise<any> => {
    console.log("API_SIM: Fetching initial data...");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API_SIM: Initial data fetched.");
            resolve({
                timetable: initialTimetableData,
                teachers: initialTeachers,
                uniqueSubjects,
                daysOfWeek,
                periods,
                subjectToDepartment,
                departmentHODs,
                absenceRequests: [...absenceRequests],
            });
        }, SIMULATED_DELAY);
    });
};

export const apiLogin = async (email: string, pass: string): Promise<User | null> => {
    console.log(`API_SIM: Attempting login for ${email}...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === pass);
            if (user) {
                console.log("API_SIM: Login successful.");
                resolve(user);
            } else {
                console.log("API_SIM: Login failed.");
                resolve(null);
            }
        }, SIMULATED_DELAY);
    });
};

export const apiUpdateTimetable = async (newTimetable: TimetableData): Promise<TimetableData> => {
    console.log("API_SIM: Updating timetable...");
    return new Promise((resolve) => {
        setTimeout(() => {
            Object.assign(initialTimetableData, newTimetable);
            console.log("API_SIM: Timetable updated successfully.");
            resolve(newTimetable);
        }, SIMULATED_DELAY);
    });
};

export const apiCreateAbsenceRequest = async (request: Omit<AbsenceRequest, 'id' | 'timestamp' | 'status'>): Promise<AbsenceRequest> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRequest: AbsenceRequest = {
                ...request,
                id: nextAbsenceId++,
                timestamp: new Date(),
                // FIX: Corrected status to match the defined type 'AbsenceRequestStatus'.
                status: 'PENDING_HOD_ACTION',
            };
            absenceRequests.push(newRequest);
            console.log("API_SIM: Created new absence request", newRequest);
            resolve(newRequest);
        }, SIMULATED_DELAY);
    });
};

export const apiReportAbsenceForTomorrow = async (teacher: User, reason: string): Promise<AbsenceRequest[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (new Date().getHours() >= 9) {
                return reject(new Error("Absence reporting for tomorrow is only available before 9:00 AM."));
            }

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dayIndex = tomorrow.getDay() - 1; 

            if (dayIndex < 0 || dayIndex > 4) {
                 return reject(new Error("Cannot report absence for a weekend."));
            }
            const tomorrowDay = daysOfWeek[dayIndex];

            const teacherClasses = initialTimetableData[tomorrowDay]
                .map((slot, index) => ({ slot, period: index + 1 }))
                .filter(({ slot }) => slot.teacher === teacher.name);
            
            if (teacherClasses.length === 0) {
                return reject(new Error(`You have no classes scheduled for tomorrow, ${tomorrowDay}.`));
            }

            const newRequests: AbsenceRequest[] = teacherClasses.map(({ slot, period }) => ({
                id: nextAbsenceId++,
                absentTeacherId: teacher.teacherId!,
                absentTeacherName: teacher.name,
                day: tomorrowDay,
                period: period,
                slot: slot,
                // FIX: Corrected status to match the defined type 'AbsenceRequestStatus'.
                status: 'PENDING_HOD_ACTION',
                timestamp: new Date(),
                reasoning: reason,
            }));

            absenceRequests.push(...newRequests);
            console.log("API_SIM: Created new absence requests for tomorrow", newRequests);
            resolve(newRequests);

        }, SIMULATED_DELAY);
    });
};

export const apiUpdateAbsenceRequest = async (requestId: number, updates: Partial<AbsenceRequest>): Promise<AbsenceRequest> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const requestIndex = absenceRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
                absenceRequests[requestIndex] = { ...absenceRequests[requestIndex], ...updates };
                console.log("API_SIM: Updated absence request", absenceRequests[requestIndex]);
                resolve(absenceRequests[requestIndex]);
            } else {
                reject(new Error("Absence request not found."));
            }
        }, SIMULATED_DELAY);
    });
};