import Game from "../game";

import { BaseInterpreter, TerminalCommand } from "./base-interpreter";
import { DotsLoadingMessage } from "../components/terminal/loading-message";

interface Attack {
  name: string;
  power: number;
}

interface Device {
  name: string;
  image: string;
  possibleAttacks: Attack[];
}

export default class FightInterpreter extends BaseInterpreter {
  private deviceHealth: number;

  constructor(
    protected game: Game,
    private device: Device
  ) {
    super(game);

    this.deviceHealth = 100;
  }

  public get options() : JQueryTerminalInterpreterOptions {
    return {
      name: "fight",
      greetings: "",
      prompt: "[[;red;]root]@fight # ",
      completion: this.autocomplete,
      onStart: (terminal: JQueryTerminal) => {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("fetching device information");
        
        this.game.screen.addDevice(this.device.image).then(() => {
          loading.stop("fetching device information [done]\n");

          this.showHelp();
        });
      },
      onExit: (terminal: JQueryTerminal) => {
        const loading = new DotsLoadingMessage(terminal);
        loading.start("fetching world");

        this.game.screen.removeDevice().then(() => {
          loading.stop("fetching world [done]");

          if (this.deviceHealth <= 0) {
            this.game.terminal.echo(`\ncongratulations, you just won against a ${this.device.name}!\n`);
          }
        });
      }
    };
  }

  protected get commands() : TerminalCommand[] {
    const commands = [];

    for  (let i = 0; i < this.device.possibleAttacks.length; i++) {
      const attack = this.device.possibleAttacks[i];

      commands.push({
        name: `${i}`,
        description: attack.name,
        execute: (argv: string[]) => {
          this.game.terminal.echo(`using '${attack.name}'`);
          this.game.terminal.echo("it's very effective!");

          this.deviceHealth -= attack.power;

          if (this.deviceHealth <= 0) {
            this.game.terminal.pop();
          } else {
            this.game.screen.shakeDevice();
          }
        }
      });
    }

    return commands;
  }
}