import Game from "../game";

import { SlashLoadingMessage } from "../components/terminal/loading-message";

import { BaseInterpreter, TerminalCommand } from "./base-interpreter";
import MapInterpreter from "./map-interpreter";
import FightInterpreter from "./fight-interpreter";

import { sprintf } from "sprintf";

interface PathElement {
  name: string;
  files: string[];
  folders: PathElement[];
}

enum PathType {
  None,
  File,
  Folder
}

import GAME_STRUCTURE = require("../../../../structure");

// statically optimized state of the player. contains the repository structure the player can move in and some devices
const OPTIMIZED_GAME = {
  structure: GAME_STRUCTURE,
  devices: [
    {
      name: "Toaster",
      image: "images/devices/toaster.png",
      possibleAttacks: [
        {
          name: "try default password",
          power: 70
        },
        {
          name: "ddos",
          power: 10
        },
        {
          name: "telnet",
          power: 20
        },
        {
          name: "social engineering with toast",
          power: 40
        }
      ]
    },
    {
      name: "Light Bulb",
      image: "images/devices/light-bulb.png",
      possibleAttacks: [
        {
          name: "try admin:admin",
          power: 100
        },
        {
          name: "trigger clapper",
          power: 1
        }
      ]
    }
  ]
};

export default class MainInterpreter extends BaseInterpreter {
  private cwd: string[];

  constructor(game: Game) {
    super(game);

    this.cwd = [];
  }

  private updatePrompt() : void {
    const cwd = [OPTIMIZED_GAME.structure.name].concat(this.cwd).join("/");
    
    this.game.terminal.set_prompt(`[[;lightgray;]user]@[[;lightgreen;]team] [[[;lightgreen;]${cwd}]] $ `);
  }

  public get options() : JQueryTerminalOptions {
    return  {
      greetings: "",
      completion: this.autocomplete,
      onInit: (terminal) => {
        const loading = new SlashLoadingMessage(terminal),
              loadingMessage = "connecting to 127.0.0.1:22";

        loading.start(loadingMessage);

        setTimeout(() => {
          this.updatePrompt();

          loading.stop(loadingMessage);

          terminal.pause(false);
          terminal.echo("connection established\n");
          terminal.echo(() => {
            const terminalWidth = terminal.cols(),
                  messages = [
                    "----------------------------------------",
                    "game-off-2016 0.0.0 (default, <browser>)",
                    "Type \"help\" for more information.",
                    "----------------------------------------"
                  ];
            
            let centeredText = "";
            
            for (const message of messages) {
              const numberOfSpaces = terminalWidth - message.length;

              if (numberOfSpaces > 0) {
                const leftSpacesLength = Math.floor(numberOfSpaces / 2);
                
                centeredText += sprintf(`%-${leftSpacesLength}s`, "") + message;
              } else {
                centeredText += message;
              }

              centeredText += "\n";
            }

            return centeredText;
          });

          setTimeout(() => {
            terminal.resume();
          }, 500);
        }, 1500);
      }
    };
  }

  private resolvePath(path: string) : string[] {
    if (path == "/") {
      return [];
    } else {
      let currentRootPath = this.cwd.map((element) => element);

      if (path.indexOf("/") == 0) {
        currentRootPath = [];
      }

      const targetParts = path.split("/").filter((element) => element.length > 0);

      for (const part of targetParts) {
        if (part == ".." && currentRootPath.length > 0) {
          currentRootPath.pop();
        } else if (part != ".") {
          currentRootPath.push(part);
        }
      }

      return currentRootPath;
    }
  }

  private identifyPath(path: string[]) : PathType {
    if (path.length == 0) {
      return PathType.Folder;
    } else {
      let cwd = OPTIMIZED_GAME.structure;

      for (const element of path) {
        let found = false;

        for (const folder of cwd.folders) {
          if (folder.name == element) {
            found = true;
            cwd = folder;

            break;
          }
        }

        if (!found) {
          return PathType.None;
        }
      }

      const basename = path.slice(-1)[0];

      if (cwd.name == basename) {
        return PathType.Folder;
      } else {
        for (const file of cwd.files) {
          if (file == basename) {
            return PathType.File;
          }
        }

        return PathType.None;
      }
    }
  }

  private echoListdir(dir: string[]) : void {
    let temp = OPTIMIZED_GAME.structure;

    for (const element of dir) {
      for (const folder of temp.folders) {
        if (folder.name == element) {
          temp = folder;
          break;
        }
      }
    }

    const folders = temp.folders.map((folder) => `[[;lightblue;]${folder.name}]`)
                                .reduce((a, b) => `${a}\t${b}`, "")
                                .trim(),
          files = temp.files.map((file) => `${file}`)
                            .reduce((a, b) => `${a}\t${b}`, "")
                            .trim();

    const contents = `${folders}\t${files}`;

    this.game.terminal.echo(contents);
  }

  protected get commands() : TerminalCommand[] {
    return [
      {
        name: "ls",
        description: "lists the content of the current directory",
        execute: (argv: string[]) => {
          if (argv.length == 2) {
            const path = argv[1].trim(),
                  resolvedPath = this.resolvePath(path),
                  pathType = this.identifyPath(resolvedPath);

            switch (pathType) {
              case PathType.File:
                this.game.terminal.echo(resolvedPath.join("/"));
                break;

              case PathType.Folder:
                this.echoListdir(resolvedPath);
                break;

              default:
                this.game.terminal.error(`no such directory: ${path}`);
                break;
            }
          } else {
            this.echoListdir(this.cwd);
          }
        }
      },
      {
        name: "cd",
        description: "change the current directory",
        execute: (argv: string[]) => {
          if (argv.length == 1) {
            this.cwd = [];
            this.updatePrompt();
          } else if (argv.length == 2) {
            const path = argv[1].trim(),
                  resolvedPath = this.resolvePath(path),
                  pathType = this.identifyPath(resolvedPath);

            switch (pathType) {
              case PathType.Folder:
                this.cwd = resolvedPath;
                this.updatePrompt();
                break;

              case PathType.File:
                this.game.terminal.error("can't cd to a file");
                break;

              default:
                this.game.terminal.error(`no such directory: ${path}`);
                break;
            }
          }
        }
      },
      {
        name: "help",
        description: "displays the help",
        man: "what did you expect?",
        execute: (argv: string[]) => {
          this.showHelp();
        }
      },
      {
        name: "man",
        man: "what did you expect?",
        description: "shows detailed help for a command",
        execute: (argv: string[]) => {
          if (argv.length > 1) {
            for (const command of this.commands) {
              if (command.name == argv[1]) {
                this.game.terminal.echo(command.man || command.description);
                break;
              }
            }
          }
        }
      },
      {
        name: "map",
        description: "opens the map",
        execute: (argv: string[]) => {
          this.game.terminal.echo("optimized away. if you like diagrams, then take a look at this voronoi diagram over there!\n");

          const mapInterpreter = new MapInterpreter(this.game);
          this.game.terminal.push(mapInterpreter.interpreter, mapInterpreter.options);
        }
      },
      {
        name: "tutorial",
        description: "starts the tutorial",
        execute: (argv: string[]) => {

        }
      },
      {
        name: "scan",
        description: "scans for devices to fight",
        execute: (argv: string[]) => {
          if (Math.random() > 0.7) {
            this.game.terminal.echo("no devices found");
          } else {
            const device = OPTIMIZED_GAME.devices[Math.floor(Math.random() * OPTIMIZED_GAME.devices.length)];

            this.game.terminal.echo(`found ${device.name}!`);

            const fightInterpreter = new FightInterpreter(this.game, device);
            this.game.terminal.push(fightInterpreter.interpreter, fightInterpreter.options);
          }
        }
      }
    ];
  }
}