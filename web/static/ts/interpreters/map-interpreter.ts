import Game from "../game";
import { BaseInterpreter } from "./base-interpreter";

export default class MapInterpreter extends BaseInterpreter {
  constructor(game: Game) {
    super(game);
  }

  protected get commands() : string[] {
    return [];
  }

  public get options() : JQueryTerminalOptions {
    return  {
      greetings: "loading map ... [done]",
      prompt: "map> ",
      exit: false,
      processArguments: true,
      completion: this.autocomplete
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