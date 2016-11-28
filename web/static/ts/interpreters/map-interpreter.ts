import { World } from "../api/world";

import Game from "../game";

import { BaseInterpreter, TerminalCommand } from "./base-interpreter";
import { DotsLoadingMessage } from "../components/terminal/loading-message";

export default class MapInterpreter extends BaseInterpreter {
  public get options() : JQueryTerminalInterpreterOptions {
    return  {
      name: "map",
      greetings: "",
      prompt: "map> ",
      completion: this.autocomplete,
      onStart: (terminal: JQueryTerminal) => {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("loading map data");
        
        this.game.screen.showMap().then((map) => {
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
        name: "?",
        description: "displays this help",
        execute: (argv: string[]) => {
          this.showHelp();
        }
      }
    ];
  }
}