
import React from 'react';
import { Notification } from '../types';

interface NotificationPanelProps {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);

const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, setNotifications }) => {
    if (notifications.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-500 animate-fade-in">
                <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                No new notifications.
            </div>
        );
    }

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'error': return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
            case 'info': return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-3 animate-slide-in-down">
            <h3 className="text-lg font-semibold text-brand-dark">Notifications</h3>
            {notifications.slice(0, 5).map(notif => (
                <div key={notif.id} className="bg-white p-3 rounded-lg shadow-md flex items-start space-x-3 transition-opacity duration-300 animate-fade-in">
                    <div className="flex-shrink-0">
                        {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.timestamp.toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationPanel;
