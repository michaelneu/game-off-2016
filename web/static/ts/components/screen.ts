import PaperElement from "./paper";
import MapElement from "./map";

export default class Screen {
  private canvas: JQuery;
  private stage: createjs.Stage;
  private map: MapElement;

  private background: createjs.Shape;
  private elements: PaperElement[];

  constructor(element: JQuery) {
    this.elements = [];
    this.map = new MapElement();
    this.canvas = element;

    this.background = new createjs.Shape();

    this.stage = new createjs.Stage(element.get(0));
    this.stage.enableMouseOver();
    this.stage.addChild(this.map, this.background);

    $(window).resize(() => this.onWindowResize());
    this.onWindowResize();
    
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", this.stage);
  }

  private onWindowResize() : void {
    const width = this.canvas.width(),
          height = this.canvas.height();

    this.canvas.attr("width", height);
    this.canvas.attr("height", height);

    this.background.graphics.beginFill("#fff").drawRect(0, 0, width, height);

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
    }, 500);
  }

  public showMap() : void {
    this.clear();
  }
}