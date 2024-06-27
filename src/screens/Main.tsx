import React, { useState, useRef, useEffect } from "react";

const Main = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [enableFlash, setEnableFlash] = useState(true);
    const [previewTime, setPreviewTime] = useState(0); // Add state for preview time
    const minutesRef = useRef<HTMLDivElement>(null);
    const secondsRef = useRef<HTMLDivElement>(null);
    const [focusedInput, setFocusedInput] = useState<"minutes" | "seconds">("minutes");

    useEffect(() => {
        // Focus on minutes input by default on app launch
        if (minutesRef.current) {
            minutesRef.current.focus();
        }

        // Listen for time updates from the timer screen
        if (window.electron?.onTimeUpdate) {
            window.electron.onTimeUpdate((event, time) => {
                setPreviewTime(time);
            });
        }
    }, []);

    const handleStart = () => {
        const totalTimeInSeconds = minutes * 60 + seconds;
        window.electron.startTimer(totalTimeInSeconds);
        refocusInput();
    };

    const handleReset = () => {
        setMinutes(0);
        setSeconds(0);
        window.electron.resetTimer();
        refocusInput();
    };

    const refocusInput = () => {
        if (focusedInput === "minutes" && minutesRef.current) {
            minutesRef.current.focus();
        } else if (focusedInput === "seconds" && secondsRef.current) {
            secondsRef.current.focus();
        }
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
        } else if (e.key === "ArrowRight" || e.key === "Tab") {
            e.preventDefault();
            if (type === "minutes") {
                setFocusedInput("seconds");
                if (secondsRef.current) {
                    secondsRef.current.focus();
                }
            }
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (type === "seconds") {
                setFocusedInput("minutes");
                if (minutesRef.current) {
                    minutesRef.current.focus();
                }
            }
        } else if (e.key === "Enter") {
            handleStart();
        }
    };

    const handleFlashToggle = () => {
        setEnableFlash(!enableFlash);
        window.electron.setFlashState(!enableFlash);
        refocusInput();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h2 className="text-4xl font-black mb-8">Set Timer</h2>
            <div className="flex mb-4 text-6xl font-bold items-center">
                <div
                    ref={minutesRef}
                    tabIndex={0}
                    className="p-4 border rounded w-32 text-center bg-gray-800 cursor-pointer flex items-center justify-center"
                    onClick={() => setFocusedInput("minutes")}
                    onKeyDown={(e) => handleKeyDown(e, "minutes")}
                >
                    {String(minutes).padStart(2, "0")}
                </div>
                <span className="mx-4">:</span>
                <div
                    ref={secondsRef}
                    tabIndex={0}
                    className="p-4 border rounded w-32 text-center bg-gray-800 cursor-pointer flex items-center justify-center"
                    onClick={() => setFocusedInput("seconds")}
                    onKeyDown={(e) => handleKeyDown(e, "seconds")}
                >
                    {String(seconds).padStart(2, "0")}
                </div>
            </div>
            <button
                className="bg-green-500 text-white p-2 rounded mb-4"
                onClick={handleStart}
            >
                Start
            </button>
            <button
                className="bg-yellow-500 text-white p-2 rounded mb-4"
                onClick={handleReset}
            >
                Reset
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={handleFlashToggle}
            >
                {enableFlash ? "Disable Flash" : "Enable Flash"}
            </button>
            <div className="mt-8 text-4xl">
                <h3 className="font-black">Preview Timer</h3>
                <p className="text-center">{formatTime(previewTime)}</p>
            </div>
        </div>
    );
};

export default Main;
