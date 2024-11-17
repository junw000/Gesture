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
  { name: 'Open', icon: '👍' }, // 0
  { name: 'Closed', icon: '✊' }, // 1
  { name: 'Pointer', icon: '👆' }, // 2
  { name: 'Ok', icon: '👌' }, // 3
  { name: 'Peace', icon: '✌️' }, // 4
  { name: 'Thumbs Up', icon: '👍' }, // 5
  { name: 'Thumbs Down', icon: '👎' }, // 6
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


    let gestureName = gesture.name;
    switch (gestureName) {
      case "Open":
        numberValue = 0;
        break;
      case "Closed":
        numberValue = 1;
        break;
      case "Pointer":
        numberValue = 2;
        break;
      case "Ok":
        numberValue = 3;
        break;
      case "Peace":
        numberValue = 4;
        break;
      case "Thumbs Up":
        numberValue = 5;
        break;
      case "Thumbs Down":
        numberValue = 6;
        break;
      default:
        numberValue = 0; 
        break;
    }

    saveGestureConfig(String(numberValue), actionType, actionInput);
    alert('Configuration Saved!');
  });
}

async function saveGestureConfig(name, type, input) {
  mappings[name] = {
    type: type,
    input: input,
  };
  await ipcRenderer.invoke('write-mappings', mappings);
}

// Handle Back button
document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('resize-window', 500, 400);
  ipcRenderer.send('set-resizable', false);
  window.location.href = 'index.html';
});
