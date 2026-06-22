import os
import json
import time
import pyttsx3
import pyaudio
from vosk import Model, KaldiRecognizer

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 170)  # Adjust speaking speed

# Load Vosk Model
MODEL_PATH = "models/vosk-model-small-en-in-0.4"
if not os.path.exists(MODEL_PATH):
    print("Vosk model not found! Download from: https://alphacephei.com/vosk/models")
    exit(1)

model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model, 16000)

# Initialize Microphone Stream
pa = pyaudio.PyAudio()
stream = pa.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=4000)
stream.start_stream()

# Function to Make Jarvis Speak
def speak(text):
    engine.say(text)
    engine.runAndWait()

# Function to Recognize Speech using Vosk
def listen():
    print("🎙 Listening...")
    data = stream.read(4000, exception_on_overflow=False)
    if recognizer.AcceptWaveform(data):
        result = json.loads(recognizer.Result())["text"]
        print(f" You said: {result}")
        return result.lower()
    return ""

# Function to Execute Commands
def execute_command(command):
    if "note" in command or "नोटपैड खोलो" in command:
        speak("Opening Notepad...")
        os.system("notepad.exe")
    elif "open website" in command or "ब्राउज़र खोलो" in command:
        speak("Opening Browser...")
        os.system("start https://www.microsoft.com/en-us/edge/?form=MA13FJ")
    elif "play music" in command or "गाना बजाओ" in command:
        speak("Playing Music...")
        os.system("start https://www.youtube.com/watch?v=LLAvgTeXXy8")
    elif "open camera" in command or "कैमरा खोलो" in command:
        speak("Opening Camera...")
        os.system("start microsoft.windows.camera:")
    elif "open calculator" in command or "कैलकुलेटर खोलो" in command:
        speak("Opening Calculator...")
        os.system("start calc")
    elif "time" in command or "समय" in command:
        speak(f"The time is {time.strftime('%H:%M')}")
    elif "bye" in command or "बंद करो" in command:
        speak("Goodbye!")
        exit()
    else:
        speak("I didn't understand that.")

# Main Loop: Always Listening
print("Say something...")
while True:
    command = listen()
    if command:
        execute_command(command)