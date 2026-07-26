
import os
import subprocess
from pynput import keyboard

def reiniciar_spotify():
    print("Reiniciando Spotify...")
    subprocess.run(["flatpak", "kill", "com.spotify.Client"])
    subprocess.Popen(["flatpak", "run", "com.spotify.Client"])

def on_activate():
    reiniciar_spotify()

hotkey = keyboard.HotKey(
    keyboard.HotKey.parse("<alt>+1"),
    on_activate
)

def canonical(f):
    return lambda k: f(listener.canonical(k))

listener = keyboard.Listener(
    on_press=canonical(hotkey.press),
    on_release=canonical(hotkey.release),
)

print("Esperando alt+1...")
listener.start()
listener.join()
