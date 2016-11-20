import Voronoi = require("voronoi");

export default class Polygon extends createjs.Container {
  public shape: createjs.Shape;

  public set stroke(stroke: any) {
    this.shape.graphics["_stroke"].style = stroke.toString();
  }

  public set fill(fill: any) {
    this.shape.graphics["_fill"].style = fill.toString();
  }

  constructor(points: Voronoi.Vertex[]) {
    super();

    this.shape = new createjs.Shape();

    const firstPoint = points.slice(-1)[0];

    this.shape.graphics.beginStroke("transparent")
                       .beginFill("transparent")
                       .moveTo(firstPoint.x, firstPoint.y);

    for (const point of points) {
      this.shape.graphics.lineTo(point.x, point.y);
    }

    this.addChild(this.shape);
  }
}