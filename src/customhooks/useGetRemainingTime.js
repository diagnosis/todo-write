import { useState, useEffect } from "react";

export default function useGetRemainingTime(due) {
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        const now = new Date();
        const timeDiff = due - now;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const timeRemaining = `${hours}h ${minutes}m`;
        setRemainingTime(timeRemaining);
    }, [due]); // Run effect when `due` changes

    const now = new Date();
    const timeDiff = due - now;

    return { remainingTime, timeDiff };
}