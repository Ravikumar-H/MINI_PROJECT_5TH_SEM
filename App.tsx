
import React, { useState, useCallback, useMemo } from 'react';
import { initialTimetableData, initialTeachers, daysOfWeek, periods, subjectToDepartment, departmentHODs, uniqueSubjects } from './data/mockData';
import { mockUsers } from './data/users';
import { TimetableData, Teacher, Notification, TimetableSlot, User } from './types';
import { findSubstitute } from './services/geminiService';
import Timetable from './components/Timetable';
import AbsenceManager from './components/AbsenceManager';
import NotificationPanel from './components/NotificationPanel';
import Header from './components/Header';
import TeacherAvailability from './components/TeacherAvailability';
import Login from './components/Login';

const App: React.FC = () => {
    const [timetable, setTimetable] = useState<TimetableData>(initialTimetableData);
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (email: string, pass: string): boolean => {
        const user = mockUsers.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        const newNotification: Notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const notifyHOD = (absentTeacherName: string, substituteTeacherName: string, slot: TimetableSlot, day: string, period: number) => {
        const department = subjectToDepartment[slot.subject];
        if (department) {
            const hodName = departmentHODs[department];
            if (hodName) {
                const message = `HOD Alert (${hodName}): For the ${slot.subject} class in Period ${period} on ${day}, ${substituteTeacherName} is substituting for ${absentTeacherName}.`;
                addNotification(message, 'info');
                console.log(`Mock HOD Notification Sent: ${message}`);
            }
        }
    };

    const handleAbsence = async (absentTeacherName: string, day: string, period: number) => {
        setIsLoading(true);
        setError(null);

        const absentTeacher = teachers.find(t => t.name === absentTeacherName);
        if (!absentTeacher) {
            setError('Selected teacher not found.');
            addNotification('Error: Selected teacher not found.', 'error');
            setIsLoading(false);
            return;
        }

        const originalSlot = timetable[day][period - 1];
        if (originalSlot.teacher !== absentTeacherName) {
            setError(`${absentTeacherName} does not have a class at the selected time.`);
            addNotification(`Error: ${absentTeacherName} does not have a class at the selected time.`, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const result = await findSubstitute(absentTeacher, day, period, timetable, teachers);
            
            if (result && result.substituteTeacherName) {
                const { substituteTeacherName } = result;
                
                const newTimetable: TimetableData = JSON.parse(JSON.stringify(timetable));

                const updatedSlot: TimetableSlot = {
                    ...newTimetable[day][period - 1],
                    teacher: substituteTeacherName,
                    isSubstitute: true,
                    originalTeacher: absentTeacherName,
                };
                newTimetable[day][period - 1] = updatedSlot;

                setTimetable(newTimetable);
                
                addNotification(`Success! ${substituteTeacherName} will substitute for ${absentTeacherName} in Period ${period}.`, 'success');
                addNotification(`Students of Class ${updatedSlot.class} have been notified about the teacher change.`, 'info');
                addNotification(`Faculty member ${substituteTeacherName} has been assigned a substitute class.`, 'info');

                notifyHOD(absentTeacherName, substituteTeacherName, updatedSlot, day, period);

            } else {
                 throw new Error('Could not find a suitable substitute.');
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.message || 'An unknown error occurred while finding a substitute.';
            setError(errorMessage);
            addNotification(`Failed to find substitute. ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTimetableSlot = useCallback((day: string, period: number, newSlotData: Partial<TimetableSlot>) => {
        setTimetable(prevTimetable => {
            const newTimetable = JSON.parse(JSON.stringify(prevTimetable));
            const currentSlot = newTimetable[day][period - 1];
            
            newTimetable[day][period - 1] = { ...currentSlot, ...newSlotData, isSubstitute: false, originalTeacher: undefined };
            
            return newTimetable;
        });
        addNotification(`Timetable for ${day}, Period ${period} updated successfully.`, 'success');
    }, [addNotification]);

    const teachersForHOD = useMemo(() => {
        if (currentUser?.role !== 'HOD' || !currentUser.department) return teachers;
        
        const departmentSubjects = Object.keys(subjectToDepartment).filter(
            subject => subjectToDepartment[subject] === currentUser.department
        );

        return teachers.filter(teacher => 
            teacher.subjects.some(subject => departmentSubjects.includes(subject))
        );
    }, [currentUser, teachers]);
    
    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    const canManageAbsence = currentUser.role === 'Admin' || currentUser.role === 'HOD';
    const canEditSchedule = currentUser.role === 'Admin';
    const canViewAvailability = currentUser.role === 'Admin' || currentUser.role === 'HOD' || currentUser.role === 'Teacher';


    return (
        <div className="min-h-screen bg-gray-50 text-brand-dark font-sans">
            <Header user={currentUser} onLogout={handleLogout} />
            <main className="container mx-auto p-4 md:p-8 space-y-8">
                <NotificationPanel notifications={notifications} setNotifications={setNotifications} />
                
                <div className={`grid grid-cols-1 ${canManageAbsence ? 'lg:grid-cols-3' : ''} gap-8 items-start`}>
                    {canManageAbsence && (
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
                            <AbsenceManager 
                                teachers={currentUser.role === 'HOD' ? teachersForHOD : teachers} 
                                onAbsenceSubmit={handleAbsence} 
                                isLoading={isLoading}
                                timetable={timetable}
                                user={currentUser}
                            />
                             {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                        </div>
                    )}

                    <div className={canManageAbsence ? "lg:col-span-2" : "col-span-1"}>
                         <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b-2 border-brand-primary pb-2">
                                Live Timetable
                            </h2>
                            <Timetable timetable={timetable} days={daysOfWeek} periods={periods} />
                        </div>
                    </div>
                </div>

                {canViewAvailability && (
                    <section className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <TeacherAvailability
                            teachers={teachers}
                            timetable={timetable}
                            days={daysOfWeek}
                            periods={periods}
                            onUpdateSlot={handleUpdateTimetableSlot}
                            allSubjects={uniqueSubjects}
                            canEdit={canEditSchedule}
                            currentUser={currentUser}
                        />
                    </section>
                )}
            </main>
        </div>
    );
};

export default App;
