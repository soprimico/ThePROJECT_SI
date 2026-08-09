import os
import time

iface = input("Interfaz (ej. wlan0): ")

while True:
    print("Cambiando MAC...")

    os.system(f"sudo ip link set {iface} down")
    os.system(f"sudo macchanger -r {iface}")
    os.system(f"sudo ip link set {iface} up")

    time.sleep(60)
