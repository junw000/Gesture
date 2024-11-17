const { ipcRenderer } = require('electron');

// Gesture definitions
const gestures = [
  { name: 'Open', icon: '🖐️' },         // 0
  { name: 'Closed', icon: '✊' },        // 1
  { name: 'Pointer', icon: '👆' },       // 2
  { name: 'OK', icon: '👌' },            // 3
  { name: 'Peace', icon: '✌️' },        // 4
  { name: 'Thumbs Up', icon: '👍' },     // 5
  { name: 'Thumbs Down', icon: '👎' },   // 6
];

const defaultMappings = {
  '0': { type: 'bash', command: 'screencapture ./screenshot.png' },
  '1': { type: 'bash', command: 'open -a "Google Chrome" https://www.wisc.edu/' },
  '2': { type: 'bash', command: '' },
  '3': { type: 'bash', command: 'mkdir TestFolder' },
  '4': { type: 'command', command: 'rmdir TestFolder' },
  '5': { type: 'macros', command: 'cmd + c' },
  '6': { type: 'bash', command: 'open -a "Google Chrome" https://www.wisc.edu/' },
};

let mappings = {};

async function loadMappings() {
  mappings = await ipcRenderer.invoke('read-mappings');

  // Assign default mappings if missing
  gestures.forEach((gesture, index) => {
    const gestureKey = String(index);
    if (!mappings[gestureKey]) {
      mappings[gestureKey] = defaultMappings[gestureKey];
    }
  });

  // Save the updated mappings with defaults
  await ipcRenderer.invoke('write-mappings', mappings);

  // Proceed to update the UI with the loaded mappings
  populateGestureList();
}

loadMappings();

function populateGestureList() {
  const gestureList = document.getElementById('gestureList');
  gestureList.innerHTML = ''; // Clear any existing content

  gestures.forEach((gesture, index) => {
    const li = document.createElement('li');
    li.classList.add('gesture-item', 'mb-2', 'p-2', 'd-flex', 'justify-content-between', 'align-items-center');
    li.style.cursor = 'pointer';

    const gestureInfo = document.createElement('span');
    gestureInfo.textContent = `${gesture.icon} ${gesture.name}`;

    const mappingInfo = document.createElement('small');
    mappingInfo.classList.add('text-muted');

    const gestureKey = String(index);
    if (mappings[gestureKey]) {
      const actionType = mappings[gestureKey].type;
      mappingInfo.textContent = `Mapped to: ${actionType}`;
    } else {
      mappingInfo.textContent = 'No mapping';
    }

    li.appendChild(gestureInfo);
    li.appendChild(mappingInfo);

    li.addEventListener('click', () => selectGesture(index));
    gestureList.appendChild(li);
  });
}

function selectGesture(index) {
  const gesture = gestures[index];
  gestureTitle.textContent = gesture.name;
  showConfigOptions(gesture, index);
}

function showConfigOptions(gesture, index) {
  const gestureKey = String(index);
  const existingConfig = mappings[gestureKey] || {};

  const type = existingConfig.type || '';
  const command = existingConfig.command || '';

  configArea.innerHTML = `
    <div class="form-group">
      <label for="actionType">Action Type</label>
      <select class="form-control" id="actionType">
        <option value="command" ${type === 'command' ? 'selected' : ''}>Command</option>
        <option value="bash" ${type.toLowerCase() === 'bash' ? 'selected' : ''}>Bash Script</option>
        <option value="macros" ${type === 'macros' ? 'selected' : ''}>Macro</option>
      </select>
    </div>
    <div class="form-group">
      <label for="actionCommand">Define Action</label>
      <textarea class="form-control" id="actionCommand" rows="5">${command}</textarea>
    </div>
    <button id="saveButton" class="btn btn-success">Save</button>
  `;

  document.getElementById('saveButton').addEventListener('click', () => {
    const actionType = document.getElementById('actionType').value;
    const actionCommand = document.getElementById('actionCommand').value;

    saveGestureConfig(gestureKey, actionType, actionCommand);
    alert('Configuration Saved!');
    // Update the gesture list to reflect changes
    populateGestureList();
  });
}

async function saveGestureConfig(key, type, command) {
  mappings[key] = {
    type: type,
    command: command,
  };
  await ipcRenderer.invoke('write-mappings', mappings);
}

const gestureTitle = document.getElementById('gestureTitle');
const configArea = document.getElementById('configArea');

// Handle Back button
document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('resize-window', 500, 400);
  ipcRenderer.send('set-resizable', false);
  window.location.href = 'index.html';
});

// Trigger to open the Edit window
document.getElementById('editButton').addEventListener('click', () => {
  ipcRenderer.send('open-edit-window');
});
