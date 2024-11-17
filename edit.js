// edit.js
const { ipcRenderer } = require('electron');

// Gesture definitions
const gestures = [
  { name: 'Open', icon: '🖐️' },       // 0
  { name: 'Closed', icon: '✊' },      // 1
  { name: 'Pointer', icon: '👆' },     // 2
  { name: 'Ok', icon: '👌' },          // 3
  { name: 'Peace', icon: '✌️' },      // 4
  { name: 'Thumbs Up', icon: '👍' },   // 5
  { name: 'Thumbs Down', icon: '👎' }, // 6
];

const defaultMappings = {
  '0': { type: 'bash', input: 'echo "Default Open Command"' },
  '1': { type: 'bash', input: 'echo "Default Closed Command"' },
  '2': { type: 'bash', input: 'echo "Default Pointer Command"' },
  '3': { type: 'bash', input: 'echo "Default Ok Command"' },
  '4': { type: 'bash', input: 'echo "Default Peace Command"' },
  '5': { type: 'bash', input: 'echo "Default Thumbs Up Command"' },
  '6': { type: 'bash', input: 'echo "Default Thumbs Down Command"' },
};

let mappings = {};

async function loadMappings() {
  mappings = await ipcRenderer.invoke('read-mappings');

  // Assign default mappings if missing
  gestures.forEach((gesture) => {
    const gestureKey = getGestureKey(gesture.name);
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

    // Check if the gesture has an existing mapping
    const gestureKey = getGestureKey(gesture.name);
    // Inside populateGestureList()
    if (mappings[gestureKey]) {
      const actionType = mappings[gestureKey].type;
      mappingInfo.innerHTML = `<span class="badge badge-success">Mapped: ${actionType}</span>`;
    } else {
      mappingInfo.innerHTML = `<span class="badge badge-secondary">No mapping</span>`;
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
  showConfigOptions(gesture);
}

function showConfigOptions(gesture) {
  const gestureKey = getGestureKey(gesture.name);
  const existingConfig = mappings[gestureKey] || {};

  const type = existingConfig.type || '';
  const input = existingConfig.input || '';

  configArea.innerHTML = `
    <div class="form-group">
      <label for="actionType">Action Type</label>
      <select class="form-control" id="actionType">
        <option value="macro" ${type === 'macro' ? 'selected' : ''}>Macro</option>
        <option value="command" ${type === 'command' ? 'selected' : ''}>Command</option>
        <option value="bash" ${type === 'bash' ? 'selected' : ''}>Bash Script</option>
      </select>
    </div>
    <div class="form-group">
      <label for="actionInput">Define Action</label>
      <textarea class="form-control" id="actionInput" rows="5">${input}</textarea>
    </div>
    <button id="saveButton" class="btn btn-success">Save</button>
  `;

  document.getElementById('saveButton').addEventListener('click', () => {
    const actionType = document.getElementById('actionType').value;
    const actionInput = document.getElementById('actionInput').value;

    saveGestureConfig(gestureKey, actionType, actionInput);
    alert('Configuration Saved!');
    // Update the gesture list to reflect changes
    populateGestureList();
  });
}

async function saveGestureConfig(name, type, input) {
  mappings[name] = {
    type: type,
    input: input,
  };
  await ipcRenderer.invoke('write-mappings', mappings);
}

function getGestureKey(gestureName) {
  switch (gestureName) {
    case 'Open':
      return '0';
    case 'Closed':
      return '1';
    case 'Pointer':
      return '2';
    case 'Ok':
      return '3';
    case 'Peace':
      return '4';
    case 'Thumbs Up':
      return '5';
    case 'Thumbs Down':
      return '6';
    default:
      return '0';
  }
}

// Handle Back button
document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('resize-window', 500, 400);
  ipcRenderer.send('set-resizable', false);
  window.location.href = 'index.html';
});
