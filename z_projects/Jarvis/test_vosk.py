# from vosk import Model, KaldiRecognizer
# import pyaudio
# import json

# MODEL_PATH = "models/vosk-model-small-en-us-0.15"
# model = Model(MODEL_PATH)
# recognizer = KaldiRecognizer(model, 16000)

# audio = pyaudio.PyAudio()
# stream = audio.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
# stream.start_stream()

# print("Say something...")

# while True:
#     data = stream.read(4096)
#     if recognizer.AcceptWaveform(data):
#         result = json.loads(recognizer.Result())
#         print("Recognized:", result["text"])
