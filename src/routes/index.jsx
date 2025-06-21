import { createFileRoute } from '@tanstack/react-router';
import { TodoService } from "../webservices/TodoServices.js";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "../TodoItem.jsx";
import { useState } from "react";
import { Grid, List } from "lucide-react";
import useListView from "../customhooks/useListView.js";

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const isListView = useListView();
    const [view, setView] = useState();
    const { error, isLoading, data } = useQuery({
        queryKey: ['todos'],
        queryFn: TodoService.getAllTodos,
    });
    if (isLoading) return <div>...Loading</div>;
    if (error) return <div>{error}</div>;


    const handleToggle = () => {
        const newView = !view;
        setView(newView);
    };

    return (
        <>
            <div className='container flex flex-col bg-black items-center relative'>
                <div className='container-header flex flex-row'>
          <span className='view-switch'>
            <button
                onClick={handleToggle}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {view ? (
                  <Grid className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              ) : (
                  <List className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              )}
            </button>
          </span>
                    <h1 className='text-3xl font-bold underline'>Task Tractor</h1>
                    <span className='todo-count absolute right-0'>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span id="taskCount">{data.length}</span> Tasks
            </span>
          </span>
                </div>
                <p>Organize your life, one task at a time</p>
                <button onClick={() => "add button clicked"}>Add New Todo</button>
                <div className={`flex ${view? 'flex-col' : 'flex-row'}`}>
                    {data.map((todo, index) => (
                        <TodoItem key={todo.id} todo={todo} index={index} isListView={view} />
                    ))}
                </div>
            </div>
        </>
    );
}