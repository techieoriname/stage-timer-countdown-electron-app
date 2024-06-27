# Timer App

Timer App is an Electron application designed to display a timer on an extended HDMI display. It uses Vite for building the React frontend and supports dynamic display detection.

## Features

- Display a timer on a secondary screen (extended display)
- Dynamic detection of connected displays
- Configurable and customizable timer settings
- Cross-platform support (Windows and macOS)

## Prerequisites

- Node.js
- Yarn
- Wine (for building Windows executables on macOS)

### Install Wine (macOS)

```bash
brew install --cask xquartz
brew install --cask wine-stable
```

## Getting Started
### Installation

1. Clone the repository:
    ```bash
        git clone https://github.com/yourusername/timer-app.git
        cd timer-app 
    ```
2. Install the dependencies:
    ```bash
   yarn install
   ```

### Development
To start the application in development mode:
```bash
yarn start
```
This will start the Electron application with hot-reloading for the React frontend.

### Build
To build the application for production:

#### macOS
```bash
yarn build:mac
```

#### Windows (on macOS using Wine)
```bash
yarn build:win
```

## Troubleshooting
### Display Issues
- Ensure the HDMI display is connected before launching the application.
- The timer window will automatically move to the second display when a new display is detected.
### Build Errors
- Make sure Wine is installed correctly on macOS.
- Check the electron-builder and electron-forge documentation for detailed build configuration options and troubleshooting.
### Contributing
Feel free to submit issues or pull requests if you have suggestions or improvements.

## License
This project is licensed under the MIT License.
