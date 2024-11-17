import json
import subprocess
import cv2
import mediapipe as mp
import os
import shutil

# Paths for Hammerspoon configuration
hammerspoon_dir = os.path.expanduser("~/.hammerspoon/")
hammerspoon_init = os.path.join(hammerspoon_dir, "init.lua")
local_hammerspoon_script = "hammerspoon_script.lua" 

# Copy the Hammerspoon script and reload Hammerspoon
def setup_hammerspoon():
    # Ensure the .hammerspoon directory exists
    os.makedirs(hammerspoon_dir, exist_ok=True)
    
    # Copy the script to Hammerspoon's config location
    shutil.copy(local_hammerspoon_script, hammerspoon_init)
    
    # Reload Hammerspoon config
    subprocess.run(["osascript", "-e", 'tell application "Hammerspoon" to reload'])
    print("Hammerspoon script copied and reloaded.")

# Load macros from the JSON file
def load_macros():
    with open("macros.json", "r") as file:
        return json.load(file)

# Execute system command or Hammerspoon action
def execute_command(command):
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"Executed: {command}")
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")

# Handle detected gestures and execute corresponding commands
def handle_gesture(gesture, macros):
    if gesture in macros:
        command = macros[gesture]
        print(f"Detected gesture: {gesture}, Executing command: {command}")
        execute_command(command)
    else:
        print(f"No macro assigned for gesture: {gesture}")

# Load macros
macros = load_macros()

# Set up Hammerspoon configuration before starting gesture detection
setup_hammerspoon()

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=2,
                       min_detection_confidence=0.5,
                       min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Initialize webcam
cap = cv2.VideoCapture(0)

# Start gesture detection loop
while True:
    ret, frame = cap.read()
    
    if not ret:
        print("Failed to grab frame")
        break

    # Convert the frame to RGB as MediaPipe requires RGB images
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame to detect hands
    results = hands.process(frame_rgb)

    # Initialize detected_gesture with a default value
    detected_gesture = "None"

    # If hands are detected
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw hand landmarks and connections
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Example: Detecting a "thumbs up" gesture
            thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
            thumb_ip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP]

            # Gesture detection logic
            if thumb_tip.x > thumb_ip.x:  # Example logic for "thumbs up"
                detected_gesture = "thumbs_up"
                handle_gesture(detected_gesture, macros)

    # Add visual feedback for detected gestures
    cv2.putText(frame,
                f"Detected Gesture: {detected_gesture}",
                (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('Gesture Control', frame)

    # Exit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and destroy windows
cap.release()
cv2.destroyAllWindows()
