import json
import os
import subprocess
import pyautogui
import platform

def get_gesture(number: int, gestures: dict):
    """
    Returns the gesture corresponding to the input number.
    """
    return gestures.get(str(number), "Unknown Gesture")

def load_gestures(file_path: str):
    """
    Loads gestures or mappings from a JSON file.
    """
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
        return data
    except Exception as e:
        raise Exception(f"Error loading gestures or mappings: {e}")

def activate_desktop():
    """
    Brings the desktop into focus based on the operating system.
    """
    os_name = platform.system().lower()

    try:
        if os_name == "windows":
            pyautogui.hotkey('win', 'd')  # Minimize all windows
        elif os_name == "darwin":  # macOS
            pyautogui.hotkey('command', 'fn', 'f3')  # Adjust for your configuration
        elif os_name == "linux":
            pyautogui.hotkey('ctrl', 'alt', 'd')  # GNOME default
        else:
            raise OSError(f"Unsupported OS: {os_name}")
        print("Desktop activated.")
    except Exception as e:
        print(f"Error activating desktop: {e}")

def execute_task(number: int, mappings: dict):
    """
    Executes tasks based on the type associated with the number in the JSON file.
    Uses a switch-case-like approach.
    """
    type = mappings.get(str(number), {}).get("type", "Unknown")
    command = mappings.get(str(number), {}).get("command", "")

    match type:
        case "bash":
            print(f"Executing Bash command: {command}")
            try:
                subprocess.run(command, shell=True, check=True)
            except Exception as e:
                print(f"Error executing Bash command: {e}")

        case "macros":
            print(f"Simulating shortcut keys: {command}")
            try:
                # Ensure the desktop environment is focused
                activate_desktop()

                # Parse and execute the key combination
                keys = [key.strip() for key in command.lower().split("+")]
                pyautogui.hotkey(*keys)
                print(f"Shortcut keys {keys} executed.")
            except Exception as e:
                print(f"Error simulating shortcut keys: {e}")

        case "command":
            print(f"Executing system command: {command}")
            try:
                os.system(command)
            except Exception as e:
                print(f"Error executing system command: {e}")

        case _:
            print(f"Unknown type or no action defined for type: {type}")

def getAction(id: int):
    """
    Main function to handle user input and execute tasks.
    """
    # Load mappings from the JSON file
    mappings_file = "./mappings.json"
    try:
        mappings = load_gestures(mappings_file)
        print(f"Loaded mappings: {mappings}")
    except Exception as e:
        print(f"Error loading mappings: {e}")
        return

    # Simulate user input from the frontend
    try:
        user_input = id
        print(f"User input received: {user_input}")

        if 0 <= user_input <= 9:
            execute_task(user_input, mappings)
        else:
            print("Invalid input. Please enter a number between 0 and 9.")
    except ValueError:
        print("Invalid input. Please enter a valid number.")
    except Exception as e:
        print(f"Unexpected error: {e}")
