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
          loading.stop("loading map data [done]");
        });
      },
      onExit(terminal: JQueryTerminal) {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("saving map state");

        setTimeout(() => {
          loading.stop("saving map state [done]");
        }, 500);
      }
    };
  }

  protected get commands() : TerminalCommand[] {
    return [];
  }
}