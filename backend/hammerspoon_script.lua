-- Hammerspoon Script for Gesture Automation
hs.alert.show("Hammerspoon Script Loaded")

-- Volume Control Functions
function increaseVolume()
    local currentVolume = hs.audiodevice.defaultOutputDevice():volume()
    hs.audiodevice.defaultOutputDevice():setVolume(math.min(currentVolume + 10, 100)) -- Prevent volume overflow
    hs.alert.show("Volume Up", 0.5)
end

function decreaseVolume()
    local currentVolume = hs.audiodevice.defaultOutputDevice():volume()
    hs.audiodevice.defaultOutputDevice():setVolume(math.max(currentVolume - 5, 0)) -- Prevent volume underflow
    hs.alert.show("Volume Down", 0.5)
end

-- Workspace Navigation Functions using AppleScript
function switchToNextWorkspace()
    hs.osascript.applescript('tell application "System Events" to key code 124 using control down') -- 124 is the key code for Right Arrow
    hs.alert.show("Next Workspace", 0.5)
end

function switchToPreviousWorkspace()
    hs.osascript.applescript('tell application "System Events" to key code 123 using control down') -- 123 is the key code for Left Arrow
    hs.alert.show("Previous Workspace", 0.5)
end

-- Space Navigation Functions
function switchToNextSpace()
    hs.eventtap.keyStroke({"ctrl"}, "right") -- Simulate Control + Right Arrow
    hs.alert.show("Next Space", 0.5)
end

function switchToPreviousSpace()
    hs.eventtap.keyStroke({"ctrl"}, "left") -- Simulate Control + Left Arrow
    hs.alert.show("Previous Space", 0.5)
end

-- Screenshot Function without Delay using Cmd+Shift+3
function takeScreenshot()
    local script = 'tell application "System Events" to key code 20 using {command down, shift down}' -- 20 is the key code for "3"
    local success, output, errorMsg = hs.osascript.applescript(script)
    if success then
        hs.alert.show("Screenshot Taken", 0.5)
    else
        hs.alert.show("Error Taking Screenshot: " .. errorMsg, 2)
        hs.console.printStyledtext("Error Taking Screenshot: " .. errorMsg)
    end
end

-- Hotkey to Take Screenshot Immediately
hs.hotkey.bind({"ctrl", "alt", "cmd"}, "S", function()
    takeScreenshot()
end)

-- Listen for AppleScript Commands to Trigger Hammerspoon Functions
hs.urlevent.bind("increaseVolume", function() increaseVolume() end)
hs.urlevent.bind("decreaseVolume", function() decreaseVolume() end)
hs.urlevent.bind("nextWorkspace", function() switchToNextWorkspace() end)
hs.urlevent.bind("previousWorkspace", function() switchToPreviousWorkspace() end)
hs.urlevent.bind("previousSpace", function() switchToPreviousSpace() end) -- For Thumbs-Down Gesture

-- Bind the Screenshot Function to a URL Event for Gestures
hs.urlevent.bind("takeScreenshot", function()
    takeScreenshot()
end)
