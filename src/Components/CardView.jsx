import { Pencil, Trash2, Clock, Tag } from "lucide-react";
import useGetRemainingTime from "../customhooks/useGetRemainingTime.js";

export default function CardView({ index, todo }) {
    const timeRemaining = useGetRemainingTime(todo.due_date)
    const isOverdue = timeRemaining.timeDiff < 0;

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
                        className="p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                        style={{ backgroundColor: '#75e6da', color: '#05445e' }}
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button 
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 hover:shadow-md"
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}