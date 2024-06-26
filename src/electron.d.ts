interface ElectronAPI {
    startTimer: (time: number, flashOnTimeOut: boolean) => void;
    onStartTimer: (callback: (event: any, { time: number, flashOnTimeout: boolean}) => void) => void;
    setFlashState: (state: boolean) => void;
    onFlashStateChange: (callback: (event: any, state: boolean) => void) => void;
}

interface Window {
    electron: ElectronAPI;
}
