import { Map } from "../api/map";

import Game from "../game";

import { BaseInterpreter, TerminalCommand } from "./base-interpreter";
import { DotsLoadingMessage } from "../components/terminal/loading-message";

export default class MapInterpreter extends BaseInterpreter {
  public get options() : JQueryTerminalInterpreterOptions {
    return  {
      greetings: "",
      prompt: "map> ",
      completion: this.autocomplete,
      onStart: (terminal: JQueryTerminal) => {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("loading map data");
        
        this.game.screen.showMap().then((map) => {
          map.on("selection", (event: createjs.Event) => {
            const repository: Map.Repository = event.data;

            this.game.terminal.set_command(`goto ${repository.name}`);
          });

          loading.stop("loading map data [done]");
        });
      },
      onExit: (terminal: JQueryTerminal) => {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("saving map state");

        this.game.screen.hideMap().then((map) => {
          loading.stop("saving map state [done]");
        });
      }
    };
  }

  protected get commands() : TerminalCommand[] {
    return [
      {
        name: "goto",
        description: "changes to the given repository",
        execute: (argv: string[]) => {
          if (argv.length != 2) {
            this.game.terminal.error("invalid parameters given. usage: \n\tgoto repository-name");
          }
        }
      }
    ];
  }
}