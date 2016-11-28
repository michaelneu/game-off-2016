abstract class LoadingMessage {
  private currentSpriteIndex: number;

  constructor(private terminal: JQueryTerminal) {
    this.currentSpriteIndex = -1;
  }

  protected abstract get sprites() : string[];
  
  public start(message: string = "") : void {
    if (this.currentSpriteIndex == -1) {
      this.terminal.pause(false);

      this.terminal.echo(message + this.sprites[0]);
      this.currentSpriteIndex = 1;
      this.update(message);
    }
  }

  private update(message?: string) : void {
    if (this.currentSpriteIndex != -1) {
      const sprite = this.sprites[this.currentSpriteIndex];
      this.terminal.update(-1, message + sprite);

      this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.sprites.length;

      setTimeout(() => {
        this.update(message);
      }, 150);
    }
  }

  public stop(doneMessage?: string) : void {
    if (this.currentSpriteIndex != -1) {
      this.currentSpriteIndex = -1;

      if (doneMessage) {
        this.terminal.update(-1, doneMessage);
      }

      this.terminal.resume();
    }
  }
}

export class SlashLoadingMessage extends LoadingMessage {
  protected get sprites() : string[] {
    return [
      " -",
      " \\",
      " |",
      " /"
    ];
  }
}

export class DotsLoadingMessage extends LoadingMessage {
  protected get sprites() : string[] {
    return [
      "      ",
      " .    ",
      " ..   ",
      " ...  ",
      "  ... ",
      "   ...",
      "    ..",
      "     ."
    ];
  }
}