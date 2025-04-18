'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const firstDay = firstDayOfMonth(currentDate);

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            days.push(
                <div
                    key={day}
                    className={`h-12 w-12 flex items-center justify-center rounded-lg
                        ${isToday ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                        cursor-pointer transition-colors duration-200`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <span className="text-xl text-gray-900 font-medium">
                                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="h-12 flex items-center justify-center text-sm font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                        {renderCalendarDays()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 