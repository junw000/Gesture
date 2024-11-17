// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const mappingsPath = path.join(__dirname, 'mappings.json');

ipcMain.handle('read-mappings', async () => {
  if (fs.existsSync(mappingsPath)) {
    const data = fs.readFileSync(mappingsPath);
    return JSON.parse(data);
  } else {
    return {};
  }
});

ipcMain.handle('write-mappings', async (event, mappings) => {
  fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
  return true;
});

let mainWindow;
let pythonProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    icon: process.platform === 'darwin' 
    ? path.join(__dirname, 'assets', 'logo.icns') 
    : process.platform === 'win32'
    ? path.join(__dirname, 'assets', 'logo.ico') 
    : path.join(__dirname, 'assets', 'logo.png'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  // Handle window resize requests
  ipcMain.on('resize-window', (event, width, height) => {
    mainWindow.setSize(width, height);
  });

  ipcMain.on('set-resizable', (event, resizable) => {
    mainWindow.setResizable(resizable);
  });

  // Listen for commands to start and stop the Python process
  ipcMain.on('start-python', (event) => {
    startPythonProcess();
  });

  ipcMain.on('stop-python', (event) => {
    stopPythonProcess();
  });

  // Ensure the Python process is terminated when the app is closed
  mainWindow.on('closed', () => {
    stopPythonProcess();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  stopPythonProcess();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Function to start the Python process
function startPythonProcess() {
  if (pythonProcess) {
    console.log('Python process already running.');
    return;
  }

  pythonProcess = spawn('python', [path.join(__dirname, 'backend', 'app.py')]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    pythonProcess = null;
  });
}

// Function to stop the Python process
function stopPythonProcess() {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
    console.log('Python process terminated.');
  }
}
