import { Map } from "../../api/map";
import PaperElement from "./paper";
import voronoi = require("voronoi-diagram");

class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public alpha: number = 1
  ) { }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
  }
}

export default class MapElement extends createjs.Container {
  constructor() {
    super();
  }

  private drawPolygon(color: Color, points: Map.Point[]) : void {
    const lastPoint = points.slice(-1)[0];
    
    const polygon = new createjs.Shape();
    const fillCommand: any = polygon.graphics.beginFill(color.toString()).command;
    polygon.graphics.beginStroke("rgba(0, 0, 0, 0.3)");

    polygon.graphics.moveTo(lastPoint.x, lastPoint.y);
    points.forEach((point) => polygon.graphics.lineTo(point.x, point.y));

    polygon.cursor = "pointer";

    polygon.on("mouseover", (event: createjs.Event) => {
      const target: createjs.Shape = event.target;

      color.alpha = 0.75;
      fillCommand.style = color.toString();
    });

    polygon.on("mouseout", (event: createjs.Event) => {
      const target: createjs.Shape = event.target;

      color.alpha = 1;
      fillCommand.style = color.toString();
    });

    this.addChild(polygon);
  }
}