import time
import tkinter as tk
from tkinter import messagebox

def show_notification(title, message):
    # Create a root window (hidden)
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    
    # Show a message box
    messagebox.showinfo(title, message)
    
    # Close the root window after displaying the message
    root.destroy()


def infinite_loop():
    while True:
        show_notification("Notification", "This is a popup notification!")

if __name__ == "__main__":
    infinite_loop()

