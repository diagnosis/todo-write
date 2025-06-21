import {Pencil, Trash2} from "lucide-react";

export default function ListView({todo, index}) {
    const now = new Date();
    const timeDiff = todo.due_date - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining = `${hours}h ${minutes}m`;
    return (
        <div
            className="flex items-center justify-between w-full bg-gradient-to-r from-purple-100 to-teal-100 p-4 rounded-lg border-l-4 border-purple-500 m-2">
            <div>
                <div className="flex items-center space-x-2">
                        <span
                            className="bg-indigo-500 text-white text-xs font-bold rounded-md w-5 h-5 flex items-center justify-center">{index+1}</span>
                    <span className="text-gray-800 font-medium">{todo.title}</span>
                </div>
                <div className="text-sm text-gray-600 space-x-4">
                    <span>Group: {todo.group}</span>
                    <span className="text-red-500">Time: {timeRemaining}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer"/>
                    <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Completed</span>
                </label>

                <button className="text-gray-500 hover:text-gray-700">
                    < Pencil/>
                </button>
                <button className="text-gray-500 hover:text-red-700">
                    <Trash2/>
                </button>
            </div>
        </div>
    )
}