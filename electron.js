const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Adjust based on your setup
    },
  });

  // Load the frontend's index.html
  const frontendPath = path.join(
    __dirname,
    "packages",
    "frontend",
    "dist",
    "index.html",
  );
  mainWindow.loadFile(frontendPath);

  // Path to the Node.js installer
  const nodeInstaller = path.join(
    __dirname,
    "installer",
    "node-v20.14.0-x64.msi",
  );

  // Check if Node.js is installed
  exec("node -v", (err, stdout, stderr) => {
    if (err) {
      // If Node.js is not installed, run the installer
      exec(`msiexec /i "${nodeInstaller}" /quiet /norestart`, (installErr) => {
        if (installErr) {
          console.error("Failed to install Node.js", installErr);
          return;
        }
        console.log("Node.js installed successfully");

        // Install pnpm using npm
        exec("npm install -g pnpm", (pnpmErr) => {
          if (pnpmErr) {
            console.error("Failed to install pnpm", pnpmErr);
            return;
          }
          console.log("pnpm installed successfully");

          // Start backend
          startBackend();
          // Start frontend
          startFrontend();
        });
      });
    } else {
      console.log(`Node.js is already installed: ${stdout}`);
      // Ensure pnpm is installed
      exec("pnpm -v", (pnpmCheckErr) => {
        if (pnpmCheckErr) {
          // Install pnpm using npm
          exec("npm install -g pnpm", (pnpmErr) => {
            if (pnpmErr) {
              console.error("Failed to install pnpm", pnpmErr);
              return;
            }
            console.log("pnpm installed successfully");
            startBackend();
            startFrontend();
          });
        } else {
          console.log("pnpm is already installed");
          startBackend();
          startFrontend();
        }
      });
    }
  });

  function startBackend() {
    const backendPath = path.join(
      __dirname,
      "packages",
      "backend",
      "dist",
      "index.js",
    );
    exec(`node ${backendPath}`, (err, stdout, stderr) => {
      if (err) {
        console.error("Failed to start backend", err);
        return;
      }
      console.log(stdout);
    });
  }

  function startFrontend() {
    exec(
      "pnpm start",
      { cwd: path.join(__dirname, "packages", "frontend") },
      (err, stdout, stderr) => {
        if (err) {
          console.error("Failed to start frontend", err);
          return;
        }
        console.log(stdout);
      },
    );
  }
}

app.on("ready", createWindow);
