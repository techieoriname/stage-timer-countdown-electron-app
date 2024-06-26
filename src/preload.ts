// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

// const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    startTimer: (time: number, flashOnTimeout: boolean) => ipcRenderer.send('start-timer', { time, flashOnTimeout }),
    onStartTimer: (callback: (event: any, { time, flashOnTimeout }: { time: number, flashOnTimeout: boolean }) => void) => ipcRenderer.on('start-timer', (event, { time, flashOnTimeout }) => callback(event, { time, flashOnTimeout })),
    setFlashState: (state: boolean) => ipcRenderer.send('set-flash-state', state),
    onFlashStateChange: (callback: (event: any, state: boolean) => void) => ipcRenderer.on('set-flash-state', (event, state) => callback(event, state)),
});
