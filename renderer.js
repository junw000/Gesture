// renderer.js
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById('runButton');
  const editButton = document.getElementById('editButton');
  const quitButton = document.getElementById('quitButton');

  if (runButton) {
    runButton.addEventListener('click', () => {
      ipcRenderer.send('start-python');
      window.location.href = 'running.html';
    });
  }

  if (editButton) {
    editButton.addEventListener('click', () => {
      ipcRenderer.send('resize-window', 1024, 768);
      ipcRenderer.send('set-resizable', true);
      window.location.href = 'edit.html';
    });
  }

  if (quitButton) {
    quitButton.addEventListener('click', () => {
      ipcRenderer.send('stop-python');
      ipcRenderer.send('resize-window', 500, 400);
      ipcRenderer.send('set-resizable', false);
      window.location.href = 'index.html';
    });
  }
});
