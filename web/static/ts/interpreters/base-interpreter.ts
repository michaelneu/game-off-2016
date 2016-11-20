import Game from "../game";
import { sprintf } from "sprintf";

export interface TerminalCommand {
  name: string;
  description: string;
  man?: string;
  execute: (args: string[]) => void;
}

export abstract class BaseInterpreter {
  constructor(protected game: Game) { }

  protected showHelp() : void {
    let maxCommandLength = 0;

    for (const command of this.commands) {
      maxCommandLength = Math.max(maxCommandLength, command.name.length)
    }

    maxCommandLength += 1;

    this.game.terminal.echo(() => {
      let helpString = "";

      const terminalWidth = this.game.terminal.cols(),
            multilineIndentationSpaces = sprintf(`%-${maxCommandLength}s`, "") + " ";

      for (const command of this.commands) {
        const paddedCommand = sprintf(`%-${maxCommandLength}s`, command.name);

        if (terminalWidth < maxCommandLength + 3) {
          helpString += `${paddedCommand}\n${command.description}\n`;
        } else {
          const lines = $.terminal.split_equal(command.description, terminalWidth - multilineIndentationSpaces.length)
                                  .reduce((a, b) => a + "\n" + multilineIndentationSpaces + b.trim(), "")
                                  .trim();

          helpString += `${paddedCommand} ${lines}`;
        }

        helpString += "\n";
      }

      return helpString;
    });
  }

  private autocompleteHandler(terminal: JQueryTerminal, command: string, callback: (result: string[]) => void) : void {
    const matchingCommands = this.commands.map((command) => command.name)
                                          .filter((commandName) => commandName.indexOf(command) == 0);

    callback(matchingCommands);
  }
  
  protected processCommand(command: string, terminal: JQueryTerminal) : void {
    const argv = $.terminal.parse_arguments(command);
    
    if (argv.length > 0) {
      for (const command of this.commands) {
        if (command.name == argv[0]) {
          command.execute.call(this, argv);
          return;
        }
      }

      this.game.terminal.error(`unknown command '${command}'`);
    }
  }

  protected readonly autocomplete = this.autocompleteHandler.bind(this);
  public readonly interpreter = this.processCommand.bind(this);

  protected abstract get commands() : TerminalCommand[];
  public abstract get options() : JQueryTerminalOptions;
}
