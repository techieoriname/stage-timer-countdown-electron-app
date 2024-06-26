interface ElectronAPI {
    startTimer: (time: number) => void;
    onStartTimer: (callback: (event: any, { time: number}) => void) => void;
    setFlashState: (state: boolean) => void;
    onFlashStateChange: (callback: (event: any, state: boolean) => void) => void;
}

interface Window {
    electron: ElectronAPI;
}
