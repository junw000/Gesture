import pyautogui
import platform

def activate_desktop():
    """
    Brings the desktop into focus based on the operating system.
    """
    os_name = platform.system().lower()

    if os_name == "windows":
        # Minimize all windows to show the desktop
        pyautogui.hotkey('win', 'd')
    elif os_name == "darwin":  # macOS
        # Use Mission Control shortcut (adjust if needed)
        pyautogui.hotkey('command', 'fn', 'f3')  # Example: Adjust for your shortcut
    elif os_name == "linux":
        # Focus desktop using a typical Linux shortcut (varies by environment)
        pyautogui.hotkey('ctrl', 'alt', 'd')  # Example: GNOME shortcut
    else:
        print(f"Unsupported OS: {os_name}")

def perform_desktop_action():
    """
    Ensures the desktop is active and performs an action like CTRL + RIGHT ARROW.
    """
    try:
        activate_desktop()  # Bring desktop into focus
        pyautogui.sleep(1)  # Wait for the desktop environment to focus
        pyautogui.hotkey('ctrl', 'right')  # Perform the desired shortcut
        print("Action performed on the desktop.")
    except Exception as e:
        print(f"Error performing desktop action: {e}")

perform_desktop_action()
