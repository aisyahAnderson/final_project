const { app, BrowserWindow, Menu, ipcMain, } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  var mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
};

function resetApp() {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    // Send a message to renderer process to clear local storage or any data
    focusedWindow.webContents.send('reset-app');

    // Reload the window after a small delay to ensure storage is cleared
    setTimeout(() => {
      focusedWindow.reload();
    }, 100);
  }
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
var mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Reload',
        click() {
          BrowserWindow.getFocusedWindow().reload();
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click() {
          console.log('About clicked');
        }
      },
      {
        label: 'Reset',
        click(){
          resetApp()
        }
      },
      {
        label: 'Back',
        click(){
          global.mainWindow.loadFile(path.join(__dirname, 'index.html'));
        }
      }
    ]
  }
];