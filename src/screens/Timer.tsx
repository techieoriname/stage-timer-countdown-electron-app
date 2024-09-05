import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [enableFlash, setEnableFlash] = useState(true);
    const [activity, setActivity] = useState("");

    useEffect(() => {

        const handleStartTimer = (_event: Electron.IpcMainEvent, timer: { time: number, activity: string }) => {
            setCurrentTime(timer.time);
            setActivity(timer.activity);
            setTimeUp(false);
        };

        const handleResetTimer = () => {
            setCurrentTime(0);
            setTimeUp(false);
            setActivity("");
        };

        window.electron.onStartTimer(handleStartTimer);
        window.electron.onResetTimer(handleResetTimer);

        const handleFlashStateChange = (_event: Electron.IpcMainEvent, state: boolean) => {
            setEnableFlash(state);
        };

        window.electron.onFlashStateChange(handleFlashStateChange);

        return () => {
            window.electron.onStartTimer(null);
            window.electron.onResetTimer(null);
            window.electron.onFlashStateChange(null);
        };
    }, []);

    useEffect(() => {
        if (currentTime > 0) {
            const interval = setInterval(() => {
                setCurrentTime(prevTime => {
                    const newTime = prevTime - 1;
                    window.electron.sendTimeUpdate(newTime);
                    if (newTime <= 0) {
                        setTimeUp(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else {
            window.electron.sendTimeUpdate(0);
        }
    }, [currentTime]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";  // Prevent NaN display
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const fontSize = "20vh";
    const textStyle = "text-[14vh]";

    return (
        <div className={`flex items-center justify-center h-screen ${timeUp && enableFlash ? 'bg-flash' : 'bg-black'}`}>
            {timeUp ? (
                <div className="flex flex-col justify-center items-center">
                    <h2 className={`font-bold text-white mt-8 uppercase ${textStyle}`}>{activity}</h2>
                    <h1 className={`font-black text-white ${enableFlash ? 'animate-flash' : ''}`} style={{ fontSize }}>TIME UP!!!</h1>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center">
                    <h2 className={`font-bold text-white mt-8 uppercase ${textStyle}`}>{activity}</h2>
                    <h1 className="font-black text-white" style={{ fontSize }}>{formatTime(currentTime)}</h1>
                </div>
            )}
        </div>
    );
};

export default Timer;
