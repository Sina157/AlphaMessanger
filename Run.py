import os

if os.path.exists("lockfile"):
    os.remove("lockfile")

os.system("python manage.py runserver")
input()