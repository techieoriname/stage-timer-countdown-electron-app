import { app, BrowserWindow, screen, ipcMain } from "electron";
import path from "path";

if (require("electron-squirrel-startup")) {
    app.quit();
}

let timerWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

// Create the main window and optionally the timer window if a second display is available
const createWindows = () => {
    const displays = screen.getAllDisplays();

    // Create the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
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

    // If there is more than one display, create the timer window
    if (displays.length > 1) {
        createTimerWindow(displays[1]);
    }
};

// Function to create the timer window on a given display
const createTimerWindow = (externalDisplay: Electron.Display) => {
    if (!timerWindow) {
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

app.on("ready", () => {
    createWindows();

    // Handle display-added event (when a new display is connected)
    screen.on("display-added", (event, newDisplay) => {
        if (!timerWindow && screen.getAllDisplays().length > 1) {
            createTimerWindow(newDisplay);
        }
    });

    // Handle display-removed event (when a display is disconnected)
    screen.on("display-removed", () => {
        if (screen.getAllDisplays().length <= 1 && timerWindow) {
            timerWindow.close();
            timerWindow = null;
        }
    });
});

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

// IPC communication for the timer window
ipcMain.on('start-timer', (event, a) => {
    if (timerWindow) {
        timerWindow.webContents.send('start-timer', { time: a.time, activity: a.activity });
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
