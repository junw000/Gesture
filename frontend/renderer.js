// renderer.js
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById('runButton');
  const editButton = document.getElementById('editButton');
  const quitButton = document.getElementById('quitButton');

  if (runButton) {
    runButton.addEventListener('click', () => {
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
      ipcRenderer.send('resize-window', 400, 300);
      ipcRenderer.send('set-resizable', false);
      window.location.href = 'index.html';
    });
  }
});
