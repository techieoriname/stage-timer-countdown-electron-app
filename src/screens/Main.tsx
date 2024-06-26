import React, { useState, useRef } from "react";

const Main = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [enableFlash, setEnableFlash] = useState(true);
    const [flashOnTimeout, setFlashOnTimeout] = useState(true);
    const minutesRef = useRef<HTMLDivElement>(null);
    const secondsRef = useRef<HTMLDivElement>(null);

    const handleStart = () => {
        const totalTimeInSeconds = minutes * 60 + seconds;
        window.electron.startTimer(totalTimeInSeconds, flashOnTimeout);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, type: "minutes" | "seconds") => {
        if (e.key === "ArrowUp") {
            if (type === "minutes") {
                setMinutes((prev) => Math.min(prev + 1, 59));
            } else {
                setSeconds((prev) => Math.min(prev + 1, 59));
            }
        } else if (e.key === "ArrowDown") {
            if (type === "minutes") {
                setMinutes((prev) => Math.max(prev - 1, 0));
            } else {
                setSeconds((prev) => Math.max(prev - 1, 0));
            }
        } else if (!isNaN(Number(e.key))) {
            if (type === "minutes") {
                setMinutes((prev) => Number(`${prev}`.slice(-1) + e.key));
            } else {
                setSeconds((prev) => Number(`${prev}`.slice(-1) + e.key));
            }
        }
    };

    const handleFlashToggle = () => {
        setEnableFlash(!enableFlash);
        window.electron.setFlashState(!enableFlash);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-4xl font-black mb-8">Set Timer</h2>
            <div className="flex mb-4 text-6xl font-bold items-center">
                <div
                    ref={minutesRef}
                    tabIndex={0}
                    className="p-4 border rounded w-32 text-center bg-white cursor-pointer flex items-center justify-center"
                    onClick={() => minutesRef.current?.focus()}
                    onKeyDown={(e) => handleKeyDown(e, "minutes")}
                >
                    {String(minutes).padStart(2, "0")}
                </div>
                <span className="mx-4">:</span>
                <div
                    ref={secondsRef}
                    tabIndex={0}
                    className="p-4 border rounded w-32 text-center bg-white cursor-pointer flex items-center justify-center"
                    onClick={() => secondsRef.current?.focus()}
                    onKeyDown={(e) => handleKeyDown(e, "seconds")}
                >
                    {String(seconds).padStart(2, "0")}
                </div>
            </div>
            <button
                className="bg-blue-500 text-white p-2 rounded mb-4"
                onClick={() => setFlashOnTimeout(!flashOnTimeout)}
            >
                {flashOnTimeout ? "Disable Flash on Timeout" : "Enable Flash on Timeout"}
            </button>
            <button
                className="bg-green-500 text-white p-2 rounded mb-4"
                onClick={handleStart}
            >
                Start
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={handleFlashToggle}
            >
                {enableFlash ? "Disable Flash" : "Enable Flash"}
            </button>
        </div>
    );
};

export default Main;
