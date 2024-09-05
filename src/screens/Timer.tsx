import React, { useState, useEffect } from "react";

interface TimerProps {
    mini?: boolean;
    time?: number;
}

const Timer: React.FC<TimerProps> = ({ mini = false}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [enableFlash, setEnableFlash] = useState(true);
    const [activity, setActivity] = useState("");

    useEffect(() => {

        const handleStartTimer = (event: Electron.IpcMainEvent, timer: { time: number, activity: string }) => {
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

        const handleFlashStateChange = (event: any, state: boolean) => {
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

    const fontSize = mini ? "6vh" : "20vh";
    const textStyle = mini ? "text-sm" : "text-[14vh]";

    return (
        <div className={`flex items-center justify-center ${timeUp && enableFlash ? 'bg-flash' : 'bg-black'} ${mini ? 'h-52' : 'h-screen'}`}>
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
