// edit.js
const { ipcRenderer } = require('electron');

// Read existing mappings
let mappings = {};

async function loadMappings() {
  mappings = await ipcRenderer.invoke('read-mappings');
  // Update UI based on mappings
}

loadMappings();

const gestures = [
  { name: 'Open', icon: '👍' },
  { name: 'Closed', icon: '✊' },
  { name: 'Ok', icon: '👌' },
  { name: 'Pointer', icon: '👆' },
  { name: 'Peace', icon: '✌️' },
  { name: 'Thumbs Up', icon: '👍' },
]; 

const gestureList = document.getElementById('gestureList');
const gestureTitle = document.getElementById('gestureTitle');
const configArea = document.getElementById('configArea');

gestures.forEach((gesture, index) => {
  const li = document.createElement('li');
  li.textContent = `${gesture.icon} ${gesture.name}`;
  li.classList.add('gesture-item', 'mb-2', 'p-2'); // Added 'p-2' for padding
  li.addEventListener('click', () => selectGesture(index));
  gestureList.appendChild(li);
});

function selectGesture(index) {
  const gesture = gestures[index];
  gestureTitle.textContent = gesture.name;
  showConfigOptions(gesture);
}

function showConfigOptions(gesture) {
  configArea.innerHTML = `
    <div class="form-group">
      <label for="actionType">Action Type</label>
      <select class="form-control" id="actionType">
        <option value="macro">Macro</option>
        <option value="command">Command</option>
        <option value="bash">Bash Script</option>
      </select>
    </div>
    <div class="form-group">
      <label for="actionInput">Define Action</label>
      <textarea class="form-control" id="actionInput" rows="5"></textarea>
    </div>
    <button id="saveButton" class="btn btn-success">Save</button>
  `;

  document.getElementById('saveButton').addEventListener('click', () => {
    const actionType = document.getElementById('actionType').value;
    const actionInput = document.getElementById('actionInput').value;

    saveGestureConfig(gesture.name, actionType, actionInput);
    alert('Configuration Saved!');
  });
}

async function saveGestureConfig(name, type, input) {
  mappings[name] = {
    type: type,
    input: input,
  };
  await ipcRenderer.invoke('write-mappings', mappings);
  alert('Configuration Saved!');
}

// Handle Back button
document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('resize-window', 500, 400);
  ipcRenderer.send('set-resizable', false);
  window.location.href = 'index.html';
});
