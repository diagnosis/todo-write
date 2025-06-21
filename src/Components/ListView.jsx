import { Pencil, Trash2, Clock, Tag } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../webservices/TodoServices.js";
import { useNavigate } from "@tanstack/react-router";

export default function ListView({ todo, index }) {
    const now = new Date();
    const timeDiff = todo.due_date - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining = `${hours}h ${minutes}m`;
    const isOverdue = timeDiff < 0;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: TodoService.deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: (error) => {
            console.error('Error deleting task:', error);
        }
    });

    // Toggle completion mutation
    const toggleCompletionMutation = useMutation({
        mutationFn: ({ id, completed }) => TodoService.updateTodo(id, { completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: (error) => {
            console.error('Error updating task:', error);
        }
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteMutation.mutate(todo.id);
        }
    };

    const handleEdit = () => {
        navigate({ to: `/edit/${todo.id}` });
    };

    const handleToggleCompletion = () => {
        toggleCompletionMutation.mutate({
            id: todo.id,
            completed: !todo.completed
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-opacity-80"
             style={{ borderLeftColor: todo.completed ? '#75e6da' : '#189ab4' }}>
            <div className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                    {/* Task Number and Status */}
                    <div className="flex items-center justify-between">
                        <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: '#05445e' }}
                        >
                            {index + 1}
                        </div>
                        <span 
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                todo.completed 
                                    ? 'text-white' 
                                    : 'text-white'
                            }`}
                            style={{ 
                                backgroundColor: todo.completed ? '#75e6da' : '#189ab4',
                                color: todo.completed ? '#05445e' : 'white'
                            }}
                        >
                            {todo.completed ? "✓ Completed" : "⏳ Pending"}
                        </span>
                    </div>

                    {/* Task Title */}
                    <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#05445e' }}>
                            {todo.title}
                        </h3>
                    </div>
                    
                    {/* Task Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>Group: <span className="font-medium">{todo.groupName || "Work"}</span></span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Due: <span className="font-medium">{todo.due_date.toLocaleDateString()}</span></span>
                        </div>
                        
                        <div className={`flex items-center space-x-1 font-medium ${isOverdue ? 'text-red-500' : 'text-orange-500'}`}>
                            <Clock className="w-4 h-4" />
                            <span>
                                {isOverdue ? "⚠️ Overdue" : `⏰ ${timeRemaining} left`}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-2">
                        <button
                            onClick={handleToggleCompletion}
                            disabled={toggleCompletionMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 ${
                                todo.completed 
                                    ? 'text-white' 
                                    : 'text-white'
                            }`}
                            style={{ 
                                backgroundColor: todo.completed ? '#75e6da' : '#189ab4',
                                color: todo.completed ? '#05445e' : 'white'
                            }}
                        >
                            {toggleCompletionMutation.isPending ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
                            ) : (
                                todo.completed ? 'Mark Pending' : 'Mark Complete'
                            )}
                        </button>

                        <div className="flex space-x-2">
                            <button 
                                onClick={handleEdit}
                                className="p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                                style={{ backgroundColor: '#75e6da', color: '#05445e' }}
                                title="Edit task"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 hover:shadow-md disabled:opacity-50"
                                title="Delete task"
                            >
                                {deleteMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border border-red-600 border-t-transparent"></div>
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Task Number */}
                        <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: '#05445e' }}
                        >
                            {index + 1}
                        </div>

                        {/* Task Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold" style={{ color: '#05445e' }}>
                                    {todo.title}
                                </h3>
                                <span 
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        todo.completed 
                                            ? 'text-white' 
                                            : 'text-white'
                                    }`}
                                    style={{ 
                                        backgroundColor: todo.completed ? '#75e6da' : '#189ab4',
                                        color: todo.completed ? '#05445e' : 'white'
                                    }}
                                >
                                    {todo.completed ? "✓ Completed" : "⏳ Pending"}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Tag className="w-4 h-4" />
                                    <span>Group: <span className="font-medium">{todo.groupName || "Work"}</span></span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Due: <span className="font-medium">{todo.due_date.toLocaleDateString()}</span></span>
                                </div>
                                
                                <div className={`flex items-center space-x-1 font-medium ${isOverdue ? 'text-red-500' : 'text-orange-500'}`}>
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {isOverdue ? "⚠️ Overdue" : `⏰ ${timeRemaining} left`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Completion Toggle Button */}
                        <button
                            onClick={handleToggleCompletion}
                            disabled={toggleCompletionMutation.isPending}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 ${
                                todo.completed 
                                    ? 'text-white' 
                                    : 'text-white'
                            }`}
                            style={{ 
                                backgroundColor: todo.completed ? '#75e6da' : '#189ab4',
                                color: todo.completed ? '#05445e' : 'white'
                            }}
                        >
                            {toggleCompletionMutation.isPending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border border-current border-t-transparent"></div>
                            ) : (
                                todo.completed ? 'Mark Pending' : 'Mark Complete'
                            )}
                        </button>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button 
                                onClick={handleEdit}
                                className="p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                                style={{ backgroundColor: '#75e6da', color: '#05445e' }}
                                title="Edit task"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 hover:shadow-md disabled:opacity-50"
                                title="Delete task"
                            >
                                {deleteMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border border-red-600 border-t-transparent"></div>
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}