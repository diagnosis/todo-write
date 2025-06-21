import { Pencil, Trash2, Clock, Tag } from "lucide-react";
import useGetRemainingTime from "../customhooks/useGetRemainingTime.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../webservices/TodoServices.js";
import { useNavigate } from "@tanstack/react-router";

export default function CardView({ index, todo }) {
    const timeRemaining = useGetRemainingTime(todo.due_date)
    const isOverdue = timeRemaining.timeDiff < 0;
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
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100">
            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold leading-tight" style={{ color: '#05445e' }}>
                        {todo.title}
                    </h3>
                    <span 
                        className="text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: '#189ab4' }}
                    >
                        #{index + 1}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2 mb-4">
                    <button
                        onClick={handleToggleCompletion}
                        disabled={toggleCompletionMutation.isPending}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 ${
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
                            <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-1"></div>
                        ) : null}
                        {todo.completed ? "✓ Completed" : "⏳ Pending"}
                    </button>
                </div>

                {/* Task Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span>Group: <span className="font-medium">{todo.groupName || "Work"}</span></span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Due: <span className="font-medium">{todo.due_date.toLocaleDateString()}</span></span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 font-medium ${isOverdue ? 'text-red-500' : 'text-orange-500'}`}>
                        <Clock className="w-4 h-4" />
                        <span>
                            {isOverdue ? "⚠️ Overdue" : `⏰ ${timeRemaining.remainingTime} left`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    Created {todo.created_at.toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={handleEdit}
                        className="p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                        style={{ backgroundColor: '#75e6da', color: '#05445e' }}
                        title="Edit task"
                    >
                        <Pencil size={16} />
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
                            <Trash2 size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}