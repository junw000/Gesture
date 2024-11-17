// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    icon: path.join(__dirname, 'assets', 'icon.png'), // Adjust if you have an icon
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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
}

app.whenReady().then(createWindow);

// Handle window-all-closed for macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Re-create a window in the app when the dock icon is clicked (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
