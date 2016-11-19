import Game from "../game";
import { BaseInterpreter } from "./base-interpreter";
import { DotsLoadingMessage } from "../components/terminal/loading-message";

export default class MapInterpreter extends BaseInterpreter {
  constructor(game: Game) {
    super(game);
  }

  protected get commands() : string[] {
    return [];
  }

  public get options() : JQueryTerminalInterpreterOptions {
    return  {
      greetings: "",
      prompt: "map> ",
      completion: this.autocomplete,
      onStart(terminal: JQueryTerminal) {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("loading map data");

        setTimeout(() => {
          loading.stop("loading map data [done]");

          terminal.echo("received data. starting interactive shell\n");
          terminal.resume();
        }, 3000);
      }
    };
  }

  public processCommand(command: string, terminal: JQueryTerminal) : void {
    switch (command) {
      default:
        super.processCommand(command, terminal);
        break;
    }
  }
}