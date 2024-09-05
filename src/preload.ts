import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    startTimer: (time: number, activity: string) => ipcRenderer.send('start-timer', { time, activity }),
    resetTimer: () => ipcRenderer.send('reset-timer'),
    setFlashState: (state: boolean) => ipcRenderer.send('set-flash-state', state),
    sendTimeUpdate: (time: number) => ipcRenderer.send('time-update', time),
    onStartTimer: (callback: (event: Electron.IpcRendererEvent, { time, activity }: { time: number, activity: string }) => void) => ipcRenderer.on('start-timer', (event, { time, activity }) => {
        callback(event, { time, activity });
    }),
    onResetTimer: (callback: () => void) => ipcRenderer.on('reset-timer', () => {
        callback();
    }),
    onFlashStateChange: (callback: (event: Electron.IpcRendererEvent, state: boolean) => void) => ipcRenderer.on('set-flash-state', (event, state) => {
        callback(event, state);
    }),
    onTimeUpdate: (callback: (event: Electron.IpcRendererEvent, time: number) => void) => ipcRenderer.on('time-update', (event, time) => {
        callback(event, time);
    }),
});
