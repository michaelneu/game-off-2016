import Game from "../game";
import { BaseInterpreter } from "./base-interpreter";
import MapInterpreter from "./map-interpreter";

export default class MainInterpreter extends BaseInterpreter {
  constructor(game: Game) {
    super(game);
  }

  protected get commands() : string[] {
    return [
      "man",
      "help",
      "map",
      "whoami"
    ];
  }

  public get options() : JQueryTerminalOptions {
    return  {
      greetings: "",
      prompt: "user@team [[;green;]repository/dir] $ ",
      exit: false,
      completion: this.autocomplete
    };
  }

  public processCommand(command: string, terminal: JQueryTerminal) : void {
    switch (command) {
      case "man":
      case "help":
        break;

      case "whoami":
        break;
      
      case "map":
        const mapInterpreter = new MapInterpreter(this.game);
        terminal.push(mapInterpreter.processCommand, mapInterpreter.options);
        break;

      default:
        super.processCommand(command, terminal);
        break;
    }
  }
}