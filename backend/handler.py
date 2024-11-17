import json
import os
import subprocess
# from Backend.app import get_gesture  # Assuming this exists and is implemented correctly

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
                import pyautogui
                import os

                # Define the specific folder where you want to save the screenshot
                save_folder = r"C:\Users\Junwoo Lee\OneDrive\바탕 화면"

                # Ensure the folder exists (if not, create it)
                os.makedirs(save_folder, exist_ok=True)

                # Define the full path to save the screenshot
                save_path = os.path.join(save_folder, 'screenshot.png')

                # Capture the screenshot
                screenshot = pyautogui.screenshot()

                # Save the screenshot to the specified path
                screenshot.save(save_path)

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
    # TODO change after fixing mappings.json
    mappings_file = "./backend/Mappings.json"
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


