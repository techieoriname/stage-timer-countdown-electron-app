import React, { useEffect } from "react";

interface TimerProps {
    mini?: boolean;
    currentTime: number;
    activity: string;
    enableFlash: boolean;
    timeUp: boolean;
}

const MiniTimer: React.FC<TimerProps> = ({ mini = false, currentTime, activity, enableFlash, timeUp }) => {
    const fontSize = mini ? "6vh" : "20vh";
    const textStyle = mini ? "text-sm" : "text-[14vh]";

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

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

export default MiniTimer;
