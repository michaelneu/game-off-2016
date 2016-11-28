#!/usr/bin/env python3

import os, os.path
import json

class Folder(object):
    def __init__(self, name):
        self.name = name
        self.files = []
        self.folders = []

def walk(dir, parent_folder):
    for element in os.listdir(dir):
        if element in ["node_modules", ".git", "_build", "priv", "deps", "config", "test", ".vscode"]:
            continue

        path = os.path.join(dir, element)

        if os.path.isfile(path):
            parent_folder.files.append(element)
        else:
            folder = Folder(element)
            parent_folder.folders.append(folder)

            walk(path, folder)

if __name__ == "__main__":
    game_structure = Folder("game-off-2016")

    walk(".", game_structure)
    
    with open("structure.ts", "w") as fp:
        structure = json.dumps(game_structure, default=lambda x: x.__dict__, indent=2)
        fp.write("export = " + structure)
