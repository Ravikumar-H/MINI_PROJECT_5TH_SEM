import React, { useState } from 'react';

interface LoginProps {
    onLogin: (email: string, pass: string) => Promise<boolean>;
}

const SmvitmLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10 10 H90 V90 H10Z" fill="#ffffff" stroke="#4f46e5" strokeWidth="5"/>
        <path d="M20 20 H80 V80 H20Z" fill="none" stroke="#4f46e5" strokeWidth="2" opacity="0.8"/>
        <text x="50" y="55" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#4f46e5" textAnchor="middle">
            SMVITM
        </text>
    </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'staff' | 'student'>('staff');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const success = await onLogin(email, password);
            if (!success) {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const fillDemoCredentials = (emailToFill: string, passToFill: string) => {
        setEmail(emailToFill);
        setPassword(passToFill);
    }

    const tabClasses = "w-full py-3 text-center font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
    const activeTabClasses = "bg-white text-brand-primary";
    const inactiveTabClasses = "bg-gray-200 text-gray-600 hover:bg-gray-300";
    
    const demoButtonClasses = "flex flex-col items-center justify-center p-3 w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8 flex flex-col items-center gap-4">
                    <SmvitmLogo />
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark">
                            Shri Madhwa Vadiraja Institute of Technology and Management
                        </h1>
                        <p className="text-brand-primary font-semibold mt-1 text-lg">Intelligent Timetable System</p>
                    </div>
                </div>

                <div className="flex">
                    <button onClick={() => setActiveTab('staff')} className={`${tabClasses} ${activeTab === 'staff' ? activeTabClasses : inactiveTabClasses}`}>
                        Staff Login
                    </button>
                    <button onClick={() => setActiveTab('student')} className={`${tabClasses} ${activeTab === 'student' ? activeTabClasses : inactiveTabClasses}`}>
                        Student Login
                    </button>
                </div>


                <div className="bg-white p-8 rounded-b-2xl shadow-lg">
                     <p className="text-gray-600 mb-6 text-center">
                        {activeTab === 'staff' 
                            ? "Please sign in to access the Admin, HOD, or Teacher dashboard."
                            : "Please sign in to view the live student timetable."
                        }
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                         {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
                 <div className="mt-6 w-full text-sm">
                     {activeTab === 'staff' && (
                        <>
                            <h4 className="font-semibold mb-3 text-center text-gray-700">Quick Access (Staff Demos)</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <button onClick={() => fillDemoCredentials('admin@school.edu', 'admin')} className={demoButtonClasses}>
                                    <span className="font-bold">Admin</span>
                                    <span className="text-xs opacity-80">Full Control</span>
                                </button>
                                <button onClick={() => fillDemoCredentials('hod.math@school.edu', 'password')} className={demoButtonClasses}>
                                     <span className="font-bold">HOD</span>
                                    <span className="text-xs opacity-80">Dept. Management</span>
                                </button>
                                <button onClick={() => fillDemoCredentials('jsmith@school.edu', 'password')} className={demoButtonClasses}>
                                     <span className="font-bold">Teacher</span>
                                    <span className="text-xs opacity-80">Absence Reporting</span>
                                </button>
                            </div>
                        </>
                     )}
                     {activeTab === 'student' && (
                         <>
                            <h4 className="font-semibold mb-3 text-center text-gray-700">Quick Access (Student Demo)</h4>
                             <button onClick={() => fillDemoCredentials('student@school.edu', 'password')} className={demoButtonClasses}>
                                <span className="font-bold">Student</span>
                                <span className="text-xs opacity-80">View Timetable</span>
                            </button>
                        </>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Login;
