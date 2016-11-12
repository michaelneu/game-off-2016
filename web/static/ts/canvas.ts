import PaperElement from "./paper";
import * as voronoi from "voronoi-diagram";

export default class Canvas {
  private canvas: JQuery;
  private stage: createjs.Stage;

  private elements: PaperElement[];

  constructor() {
    this.elements = [];

    this.canvas = $("canvas");
    this.stage = new createjs.Stage(this.canvas.get(0));

    $(window).resize(() => this.onWindowResize());
    this.onWindowResize();
    
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", this.stage);
  }

  private onWindowResize() : void {
      this.canvas.attr("width", this.canvas.width());
      this.canvas.attr("height", this.canvas.height());

      this.stage.update();
  }

  public add(...elements: PaperElement[]) : void {
    for (const element of elements) {
      const y = element.y;

      element.y = -element.height;

      this.stage.addChild(element);

      element.asTween()
        .to({
          x: element.x,
          y: y
        }, 500);
    }

    this.elements = this.elements.concat(elements);
  }

  public clear() : void {
    for (let element of this.elements) {
      element.asTween()
        .to({
          x: -element.width,
          y: -element.height
        }, 500);
    }

    setTimeout(() => {
      this.stage.removeChild.apply(this.stage, this.elements);
      this.elements = [];
    }, 1000);
  }
}