import Game from "../game";

export abstract class BaseInterpreter {
  constructor(protected game: Game) { }

  private autocompleteHandler(terminal: JQueryTerminal, command: string, callback: (result: string[]) => void) : void {
    const matchingCommands = this.commands.filter((command) => command.indexOf(command) == 0);

    callback(matchingCommands);
  }

  protected readonly autocomplete = this.autocompleteHandler.bind(this);

  protected abstract get commands() : string[];
  public abstract get options() : JQueryTerminalOptions;
  
  public processCommand(command: string, terminal: JQueryTerminal) : void {
    if (command) {
      terminal.error(`unknown command '${command}'`);
    }
  }
}
