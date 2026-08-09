import os
import time
opened = True

verified_hwids = ["bbec739f6820436ab84697816e5d5c8b","hola"]
with open("/etc/machine-id", "r") as f:
	hwid = f.read().strip()
if hwid in verified_hwids:

	intFACE = input("Interfaz (example. wlan0): ")

	print("Debian: 1")
	print("Arch: 2")

	type_linux = input("what linux are u using? (number 1 or 2): ")
	if type_linux == "1":
		print("Downlading the tool...")
		os.system("sudo apt install macchanger")
	elif type_linux == "2":
		print("Downloading the tool...")
		os.system("sudo pacman -S macchanger")
	else:
		print("ERROR")


	def wait(t):
		time.sleep(t)

	while opened:
		os.system(f"sudo ip link set {intFACE} down")
		os.system(f"sudo macchanger -r {intFACE}")
		os.system(f"sudo ip link set {intFACE} up")
		wait(60)
elif hwid not in verified_hwids:
	print("You didn't owned the script yet! REMEMBER 2 EUROS!")
else:
	print("ERROR! bomboclat")