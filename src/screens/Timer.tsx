import React, { useState, useEffect } from "react";

const Timer = () => {
    const [time, setTime] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [enableFlash, setEnableFlash] = useState(true);
    const [flashOnTimeout, setFlashOnTimeout] = useState(true);

    useEffect(() => {
        const handleStartTimer = (event: any, { time: totalTimeInSeconds, flashOnTimeout }: { time: number, flashOnTimeout: boolean }) => {
            setTime(totalTimeInSeconds);
            setFlashOnTimeout(flashOnTimeout);
            setTimeUp(false); // Reset timeUp state when starting a new timer
        };

        window.electron.onStartTimer(handleStartTimer);

        const handleFlashStateChange = (event: any, state: boolean) => {
            setEnableFlash(state);
        };

        window.electron.onFlashStateChange(handleFlashStateChange);

        return () => {
            window.electron.onStartTimer(null);
            window.electron.onFlashStateChange(null);
        };
    }, []);

    useEffect(() => {
        if (time > 0) {
            const interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        setTimeUp(true); // Set time up state when timer reaches zero
                        clearInterval(interval);
                        return 0;
                    }
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [time]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className={`flex items-center justify-center h-screen ${timeUp && enableFlash && flashOnTimeout ? 'bg-flash' : 'bg-black'}`}>
            {timeUp ? (
                <h1 className={`text-9xl font-black text-white ${enableFlash && flashOnTimeout ? 'animate-flash' : ''}`}>TIME UP!!!</h1>
            ) : (
                <h1 className="font-black text-white" style={{ fontSize: '10vw' }}>{formatTime(time)}</h1>
            )}
        </div>
    );
};

export default Timer;
