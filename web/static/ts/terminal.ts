export default class Terminal {
  private terminalContainer: JQuery;
  private terminalInstance: JQueryTerminal;

  public interpreter: (command: string, terminal: JQueryTerminal) => void;

  constructor(options: JQueryTerminalOptions) {
    this.terminalContainer = $(".terminal");
    this.terminalInstance = this.terminalContainer.terminal(this.terminalInterpreter.bind(this), options);
  }

  private terminalInterpreter(command: string, terminal: JQueryTerminal) : void {
    if (this.interpreter) {
      this.interpreter.call(this.terminalInstance, command, terminal);
    }
  }
}