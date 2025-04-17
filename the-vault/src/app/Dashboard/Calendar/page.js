'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [notes, setNotes] = useState({});
    const [newNote, setNewNote] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);

    // Load notes from localStorage on component mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('calendarNotes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('calendarNotes', JSON.stringify(notes));
    }, [notes]);

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

    const formatDateKey = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
        setShowNoteModal(true);
    };

    const addNote = () => {
        if (newNote.trim() && selectedDate) {
            const dateKey = formatDateKey(selectedDate);
            const updatedNotes = { ...notes };
            
            if (!updatedNotes[dateKey]) {
                updatedNotes[dateKey] = [];
            }
            
            updatedNotes[dateKey].push({
                id: Date.now(),
                text: newNote,
                createdAt: new Date().toISOString()
            });
            
            setNotes(updatedNotes);
            setNewNote('');
        }
    };

    const deleteNote = (dateKey, noteId) => {
        const updatedNotes = { ...notes };
        updatedNotes[dateKey] = updatedNotes[dateKey].filter(note => note.id !== noteId);
        
        if (updatedNotes[dateKey].length === 0) {
            delete updatedNotes[dateKey];
        }
        
        setNotes(updatedNotes);
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
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateKey = formatDateKey(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const hasNotes = notes[dateKey] && notes[dateKey].length > 0;
            
            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-12 w-12 flex flex-col items-center justify-center rounded-lg relative
                        ${isToday ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                        cursor-pointer transition-colors duration-200`}
                >
                    <span>{day}</span>
                    {hasNotes && (
                        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    )}
                </div>
            );
        }

        return days;
    };

    const renderNotesForSelectedDate = () => {
        if (!selectedDate) return null;
        
        const dateKey = formatDateKey(selectedDate);
        const dateNotes = notes[dateKey] || [];
        
        return (
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                    Notes for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </h3>
                
                {dateNotes.length > 0 ? (
                    <div className="space-y-3">
                        {dateNotes.map(note => (
                            <div key={note.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                                <p className="text-gray-700">{note.text}</p>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNote(dateKey, note.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No notes for this date.</p>
                )}
                
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addNote();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                    </button>
                </div>
            </div>
        );
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
                    
                    {renderNotesForSelectedDate()}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 