import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { join, resolve } from "path";
import * as fs from "fs";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

let mainWindow;

// set custom protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("electron-fiddle", process.execPath, [
      resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("electron-fiddle");
  }
}

// open from browser for windows
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    // the url str ends with /
    const url = new URL(commandLine.pop().slice(0, -1));
    const params = new URLSearchParams(url.hash.slice(1)); // Remove the leading '#'
    const access_token = params.get("access_token");

    if (!access_token) {
      dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
      mainWindow.webContents.send("send-access-token", {});
    } else {
      mainWindow.webContents.send("send-access-token", {
        access_token,
      });
    }
  });
}

// open from browser from mac/linux
app.on("open-url", (event, url) => {
  dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
});

async function extractMP3Metadata(directory, name) {
  try {
    const { parseFile } = await import("music-metadata");
    const filePath = `${directory}/${name}`;
    const metadata = await parseFile(filePath);
    const { title, album, artist } = metadata.common;
    return { title, album, artist, name };
  } catch (error) {
    console.log(error);
    return { name };
  }
}

async function extractDataFromSongs(directory) {
  const data = {
    error: null,
    metadataArray: [],
    songsUnableToParse: [],
  };
  const metadataArray = [];
  const songsUnableToParse = [];

  try {
    const files = fs.readdirSync(directory);
    const mp3Files = files.filter(
      (file) => file.endsWith(".mp3") || file.endsWith(".m4a")
    );
    for (const file of mp3Files) {
      const metadata = await extractMP3Metadata(directory, file);
      metadataArray.push(metadata);
    }
    data.metadataArray = metadataArray;
    data.songsUnableToParse = songsUnableToParse;
    return data;
  } catch (error) {
    console.log("Error extracting MP3 metadata:", error);
    data.metadataArray = metadataArray;
    data.error = error;
    return data;
  }
}

// ipcMain.handle('fetch-metadata', async (event, arg) => {
ipcMain.handle("fetch-metadata", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Select the folder which contains your music files",
    properties: ["openDirectory"],
  });

  let musicData;
  if (result.filePaths) {
    musicData = await extractDataFromSongs(result.filePaths[0]);
  }
  return musicData;
});

ipcMain.handle("open-url", async (event, arg) => {
  shell.openExternal(arg);
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
