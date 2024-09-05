interface ElectronAPI {
    startTimer: (time: number, activity: string) => void;
    onStartTimer: (callback: (event: Electron.IpcMainEvent, { time , activity}: { time: number, activity: string }) => void) => void;
    resetTimer: () => void;
    onResetTimer: (callback: () => void) => void;
    setFlashState: (state: boolean) => void;
    onFlashStateChange: (callback: (event: Electron.IpcMainEvent, state: boolean) => void) => void;
    sendTimeUpdate: (time: number) => void;
    onTimeUpdate: (callback: (event: Electron.IpcMainEvent, time: number) => void) => void;
}

interface Window {
    electron: ElectronAPI;
}
