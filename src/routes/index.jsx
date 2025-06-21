import {createFileRoute, createRouter, Link} from '@tanstack/react-router';
import { TodoService } from "../webservices/TodoServices.js";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "../TodoItem.jsx";
import { useState } from "react";
import { Grid, List, Plus, Calendar, CheckCircle, ArrowUpDown, Clock } from "lucide-react";
import useListView from "../customhooks/useListView.js";
import {routeTree} from "../routeTree.gen.js";

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const isListView = useListView();
    const [view, setView] = useState(false);
    const [sortBy, setSortBy] = useState('status'); // 'status', 'due_date'
    const { error, isLoading, data } = useQuery({
        queryKey: ['todos'],
        queryFn: TodoService.getAllTodos,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4f1f4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#05445e' }}></div>
                    <p className="text-lg font-medium" style={{ color: '#05445e' }}>Loading your tasks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4f1f4' }}>
                <div className="text-center p-8 rounded-lg shadow-lg bg-white">
                    <p className="text-lg font-medium text-red-600">Error loading tasks: {error}</p>
                </div>
            </div>
        );
    }

    const handleToggle = () => {
        const newView = !view;
        setView(newView);
    };

    // Sort tasks function
    const sortTasks = (tasks) => {
        if (!tasks) return [];
        
        const sortedTasks = [...tasks].sort((a, b) => {
            if (sortBy === 'status') {
                // First sort by completion status (pending first, completed last)
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                // Then sort by due date within each status group
                return new Date(a.due_date) - new Date(b.due_date);
            } else if (sortBy === 'due_date') {
                // First sort by completion status (pending first, completed last)
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                // Then sort by due date within each status group
                return new Date(a.due_date) - new Date(b.due_date);
            }
            return 0;
        });
        
        return sortedTasks;
    };

    const sortedData = sortTasks(data);
    const completedTasks = data?.filter(todo => todo.completed).length || 0;
    const totalTasks = data?.length || 0;
    const pendingTasks = totalTasks - completedTasks;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#d4f1f4' }}>
            {/* Header Section */}
            <div className="shadow-lg" style={{ backgroundColor: '#05445e' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                Task Tractor
                            </h1>
                            <p className="text-lg opacity-90" style={{ color: '#75e6da' }}>
                                Organize your life, one task at a time
                            </p>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="flex flex-wrap gap-4 mt-6 md:mt-0">
                            <div className="px-4 py-2 rounded-lg shadow-md" style={{ backgroundColor: '#189ab4' }}>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-white" />
                                    <span className="text-white font-semibold">{totalTasks} Total</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg shadow-md" style={{ backgroundColor: '#75e6da' }}>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5" style={{ color: '#05445e' }} />
                                    <span className="font-semibold" style={{ color: '#05445e' }}>{completedTasks} Done</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleToggle}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                            style={{ 
                                backgroundColor: view ? '#189ab4' : '#75e6da',
                                color: view ? 'white' : '#05445e'
                            }}
                        >
                            {view ? (
                                <>
                                    <List className="w-5 h-5" />
                                    <span>List View</span>
                                </>
                            ) : (
                                <>
                                    <Grid className="w-5 h-5" />
                                    <span>Grid View</span>
                                </>
                            )}
                        </button>

                        {/* Sort Dropdown */}
                        <div className="flex items-center space-x-2">
                            <ArrowUpDown className="w-4 h-4" style={{ color: '#05445e' }} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-300 font-medium transition-all duration-200 focus:ring-2 focus:border-transparent"
                                style={{ 
                                    color: '#05445e',
                                    focusRingColor: '#75e6da',
                                    '--tw-ring-color': '#75e6da'
                                }}
                            >
                                <option value="status">Sort by Status</option>
                                <option value="due_date">Sort by Due Date</option>
                            </select>
                        </div>
                        
                        <div className="text-sm font-medium" style={{ color: '#05445e' }}>
                            {pendingTasks} pending tasks
                        </div>
                    </div>

                    <Link to={'/post'}
                        className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                        style={{ backgroundColor: '#189ab4' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Task</span>
                    </Link>
                </div>

                {/* Tasks Container */}
                {sortedData && sortedData.length > 0 ? (
                    <div className={`${view ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
                        {sortedData.map((todo, index) => (
                            <TodoItem key={todo.id} todo={todo} index={index} isListView={view} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#75e6da' }}>
                            <Calendar className="w-12 h-12" style={{ color: '#05445e' }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#05445e' }}>No tasks yet</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first task</p>
                        <Link to={'/post'}
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                            style={{ backgroundColor: '#189ab4' }}
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create First Task</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}