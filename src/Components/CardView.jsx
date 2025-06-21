import { Pencil, Trash2 } from "lucide-react";

export default function CardView({ index, todo }) {
    const now = new Date();
    const timeDiff = todo.due_date - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining = `${hours}h ${minutes}m`;

    return (
        <a
            href="#"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
            <div className="flex justify-between items-start mb-2">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {todo.title}
                </h5>
                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
          #{index + 1}
        </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>STATUS: <span className="font-medium">{todo.completed ? "Completed" : "Pending"}</span></p>
                <p>GROUP: <span className="font-medium">{todo.groupName || "Work"}</span></p>
                <p>
                    DUE DATE: <span className="font-medium">{todo.due_date.toLocaleString()}</span>
                </p>
                <p className="text-red-500 font-medium">
                    TIME REMAINING: {timeDiff > 0 ? `due by ${timeRemaining}` : "Overdue"}
                </p>
            </div>
            <div className="flex justify-between mt-4">
                <button className="text-green-500 hover:text-green-700">
                    <Pencil size={18} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                </button>
            </div>
        </a>
    );
}