import Game from "../game";

import { SlashLoadingMessage } from "../components/terminal/loading-message";

import { BaseInterpreter, TerminalCommand } from "./base-interpreter";
import MapInterpreter from "./map-interpreter";

import { sprintf } from "sprintf";

export default class MainInterpreter extends BaseInterpreter {
  public get options() : JQueryTerminalOptions {
    return  {
      greetings: "",
      completion: this.autocomplete,
      onInit: (terminal) => {
        const loading = new SlashLoadingMessage(terminal),
              loadingMessage = "connecting to 127.0.0.1:22";

        loading.start(loadingMessage);

        setTimeout(() => {
          terminal.set_prompt("user@[[;lightgreen;]team] [[[;lightgreen;]repository/dir]] $ ");

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

  protected get commands() : TerminalCommand[] {
    return [
      {
        name: "cd",
        description: "change the current directory",
        execute: (argv: string[]) => {

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
          const mapInterpreter = new MapInterpreter(this.game);
          this.game.terminal.push(mapInterpreter.interpreter, mapInterpreter.options);
        }
      },
      {
        name: "pwn",
        description: "pwn this repository",
        man: "starts the fight required to own this repository",
        execute: (argv: string[]) => {
          
        }
      },
      {
        name: "tutorial",
        description: "starts the tutorial",
        execute: (argv: string[]) => {
          
        }
      },
      {
        name: "whoami",
        description: "displays your name",
        execute: (argv: string[]) => {
          
        }
      }
    ];
  }
}