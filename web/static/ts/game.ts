import Screen from "./components/screen";
import MainInterpreter from "./interpreters/main-interpreter";

export default class Game {
  private $window: JQuery = $(window);

  private $screen: JQuery;
  private _screen: Screen;

  private $terminal: JQuery;
  private _terminal: JQueryTerminal;

  public get screen() : Screen {
    return this._screen;
  }

  public get terminal() : JQueryTerminal {
    return this._terminal;
  }

  constructor(screenSelector: string, terminalSelector: string) {
    this.$screen = $(screenSelector);
    this._screen = new Screen(this.$screen);

    const mainInterpreter = new MainInterpreter(this);

    this.$terminal = $(terminalSelector);
    this._terminal = this.$terminal.terminal(mainInterpreter.processCommand, mainInterpreter.options);
  }

  public play() : void {
    const terminalRelativeWidth = this.$terminal.outerWidth() / this.$window.width() * 100,
          screenRelativeWidth = 100 - terminalRelativeWidth,
          screenBorderWidth = this.$screen.outerWidth() - this.$screen.innerWidth();
    
    this.$screen.css("width", `calc(${screenRelativeWidth}% + ${screenBorderWidth}px)`);
  }
}