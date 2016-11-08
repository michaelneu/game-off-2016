export default class Canvas {
  private canvas: JQuery;
  private stage: createjs.Stage;

  constructor() {
    this.canvas = $("canvas");
    this.stage = new createjs.Stage(this.canvas.get(0));

    $(window).resize(this.onWindowResize.bind(this));
    this.onWindowResize();
    
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", this.stage);
  }

  private onWindowResize() : void {
      this.canvas.attr("width", this.canvas.width());
      this.canvas.attr("height", this.canvas.height());

      this.stage.update();
  }
}