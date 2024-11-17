import time
import os

def infinite_loop():
    while True:
        
        title = "Success"
        message = "File downloaded"
        command = f'''
        osascript -e 'display notification "{message}" with title "{title}"'
        '''
        os.system(command)

        time.sleep(3)  # Pause for 3 seconds

if __name__ == "__main__":
    infinite_loop()

