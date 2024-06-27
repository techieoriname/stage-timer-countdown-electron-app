import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    startTimer: (time: number) => ipcRenderer.send('start-timer', { time }),
    resetTimer: () => ipcRenderer.send('reset-timer'),
    setFlashState: (state: boolean) => ipcRenderer.send('set-flash-state', state),
    sendTimeUpdate: (time: number) => ipcRenderer.send('time-update', time), // Add this line
    onStartTimer: (callback: (event: any, { time }: { time: number }) => void) => ipcRenderer.on('start-timer', (event, { time }) => {
        callback(event, { time });
    }),
    onResetTimer: (callback: () => void) => ipcRenderer.on('reset-timer', () => {
        callback();
    }),
    onFlashStateChange: (callback: (event: any, state: boolean) => void) => ipcRenderer.on('set-flash-state', (event, state) => {
        callback(event, state);
    }),
    onTimeUpdate: (callback: (event: any, time: number) => void) => ipcRenderer.on('time-update', (event, time) => {
        callback(event, time);
    }),
});
