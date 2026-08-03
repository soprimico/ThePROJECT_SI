import os
from pydub import AudioSegment
from pydub.playback import play

mp3s = [f for f in os.listdir(".") if f.endswith(".mp3")]

if not mp3s:
    print("No hay MP3 en la carpeta")
    exit()

print("Sonidos disponibles:\n")

for i, mp3 in enumerate(mp3s):
    print(f"{i + 1}. {mp3}")

opcion = int(input("\nElige un sonido: ")) - 1

audio = AudioSegment.from_mp3(mp3s[opcion])

print(f"Reproduciendo {mp3s[opcion]}...")
play(audio)