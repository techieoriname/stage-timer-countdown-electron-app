import { app, BrowserWindow, screen, ipcMain } from "electron";
import path from "path";

if (require("electron-squirrel-startup")) {
    app.quit();
}

let timerWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

const createWindows = () => {
    const displays = screen.getAllDisplays();

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }

    // if (process.env.NODE_ENV === "development") {
    //     mainWindow.webContents.openDevTools({ mode: "detach" });
    // }

    if (displays.length > 1) {
        const externalDisplay = displays[1];

        timerWindow = new BrowserWindow({
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            width: externalDisplay.bounds.width,
            height: externalDisplay.bounds.height,
            fullscreen: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            timerWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}#/timer`);
        } else {
            timerWindow.loadURL(
                `file://${path.join(__dirname, "..", `renderer/${MAIN_WINDOW_VITE_NAME}`, "index.html")}#/timer`
            );
        }
    }
};

app.on("ready", createWindows);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
});

ipcMain.on('start-timer', (event, { time }) => {
    if (timerWindow) {
        timerWindow.webContents.send('start-timer', { time });
    }
});

ipcMain.on('reset-timer', () => {
    if (timerWindow) {
        timerWindow.webContents.send('reset-timer');
    }
});

ipcMain.on('set-flash-state', (event, state) => {
    if (timerWindow) {
        timerWindow.webContents.send('set-flash-state', state);
    }
});

ipcMain.on('time-update', (event, time) => {
    if (mainWindow) {
        mainWindow.webContents.send('time-update', time);
    }
});
