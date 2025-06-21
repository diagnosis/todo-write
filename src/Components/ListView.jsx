import { Pencil, Trash2, Clock, Tag, CheckCircle } from "lucide-react";

export default function ListView({ todo, index }) {
    const now = new Date();
    const timeDiff = todo.due_date - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining = `${hours}h ${minutes}m`;
    const isOverdue = timeDiff < 0;

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-opacity-80"
             style={{ borderLeftColor: todo.completed ? '#75e6da' : '#189ab4' }}>
            <div className="p-6">
                <div className="flex items-center justify-between">
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
                        {/* Completion Toggle */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={todo.completed}
                                className="sr-only peer"
                                onChange={() => console.log('Toggle completion')}
                            />
                            <div className="relative w-11 h-6 rounded-full peer transition-colors duration-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                                 style={{ 
                                     backgroundColor: todo.completed ? '#75e6da' : '#d1d5db'
                                 }}>
                            </div>
                            <span className="ml-3 text-sm font-medium" style={{ color: '#05445e' }}>
                                {todo.completed ? 'Completed' : 'Mark Complete'}
                            </span>
                        </label>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button 
                                className="p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                                style={{ backgroundColor: '#75e6da', color: '#05445e' }}
                                title="Edit task"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 hover:shadow-md"
                                title="Delete task"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}