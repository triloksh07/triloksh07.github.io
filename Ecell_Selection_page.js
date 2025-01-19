import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, X, ChevronLeft } from 'lucide-react';

// Navbar Component
const Navbar = ({ notifications, onNotificationClick, userName }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <span className="font-bold text-xl">E-Cell Portal</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userName && (
                            <>
                                <button
                                    className="relative p-2 rounded-full hover:bg-blue-700"
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                >
                                    <Bell size={20} />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                                    )}
                                </button>
                                <div className="flex items-center space-x-2">
                                    <User size={20} />
                                    <span>{userName}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-md hover:bg-blue-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        {userName && (
                            <div className="space-y-2">
                                <button
                                    className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700"
                                    onClick={() => {
                                        onNotificationClick();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <Bell size={20} />
                                    <span>Notifications</span>
                                    {notifications.length > 0 && (
                                        <span className="bg-red-500 rounded-full px-2 text-sm">
                      {notifications.length}
                    </span>
                                    )}
                                </button>
                                <div className="flex items-center space-x-2 px-3 py-2">
                                    <User size={20} />
                                    <span>{userName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Notifications dropdown */}
            {isNotificationOpen && notifications.length > 0 && (
                <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-xl text-gray-800 z-50">
                    <div className="p-4">
                        <h3 className="font-bold mb-2">Notifications</h3>
                        {notifications.map((notification, index) => (
                            <div
                                key={index}
                                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            >
                                {notification}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Main Application Component
const EcellPortal = () => {
    const [currentScreen, setCurrentScreen] = useState('login');
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simulated CSV data check
    const checkSelection = async (uid) => {
        setIsLoading(true);
        setError(null);

        try {
            // In a real application, this would be an API call
            // Simulating the CSV check from your original code
            const response = await fetch('selected_uids.csv');
            const data = await response.text();
            const uids = data.split('\n').map(uid => uid.trim());

            if (uids.includes(uid)) {
                setCurrentScreen('success');
                setNotifications(prev => [...prev, 'Congratulations! You have been selected.']);
            } else {
                setCurrentScreen('failure');
            }
        } catch (err) {
            setError('An error occurred while checking your selection status. Please try again later.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        checkSelection(enrollmentNumber);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'login':
                return (
                    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            {/* Left side with illustration */}
                            <div className="bg-gray-50 p-6 flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h2>
                                <div className="text-gray-600">
                                    Sign in to E-Cell Selection Portal
                                </div>
                            </div>

                            {/* Right side with form */}
                            <div className="bg-blue-600 p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter Enrollment Number"
                                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={enrollmentNumber}
                                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Checking...' : 'Check Result'}
                                    </button>
                                    {error && (
                                        <div className="text-red-500 text-sm mt-2">{error}</div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="w-full max-w-md mx-auto bg-green-500 text-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Congrats {enrollmentNumber}!</h2>
                        <p className="mb-4">You're Selected in E-Cell.</p>
                        <button
                            onClick={() => setCurrentScreen('details')}
                            className="bg-white text-green-500 px-4 py-2 rounded-md hover:bg-green-50 transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                );

            case 'failure':
                return (
                    <div className="w-full max-w-md mx-auto bg-red-500 text-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Sorry {enrollmentNumber}</h2>
                        <p className="mb-4">We regret to inform you that you have not been selected in E-Cell.</p>
                        <button
                            onClick={() => setCurrentScreen('login')}
                            className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                );

            case 'details':
                return (
                    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setCurrentScreen('success')}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="text-2xl font-bold ml-2">Account Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Enrollment Number:</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled
                                    value={enrollmentNumber}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentScreen('login');
                                    setEnrollmentNumber('');
                                    setNotifications([]);
                                }}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                notifications={notifications}
                onNotificationClick={() => {}}
                userName={currentScreen !== 'login' ? enrollmentNumber : null}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center">
                    {renderScreen()}
                </div>
            </div>
        </div>
    );
};

export default EcellPortal;