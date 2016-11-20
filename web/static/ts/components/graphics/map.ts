import { Map } from "../../api/map";

import Color from "./color";
import PaperElement from "./paper";

import voronoi = require("voronoi-diagram");

export default class MapElement extends createjs.Container {
  constructor() {
    super();
  }

  public show() : Promise<MapElement> {
    return Map.getPoints().then((points) => {
      const diagram = voronoi(points.map((point) => [point.x, point.y]));

      for (let i = 0; i < points.length; i++) {
        const point = points[i],
              cell = diagram.cells[i];
        
        if (cell.indexOf(-1) == -1) {
          const points = [];

          for (const cellIndex of cell) {
            points.push(diagram.positions[cellIndex]);
          }

          console.log(points);
        }

        const circle = new createjs.Shape();
        circle.graphics.beginFill("black").drawCircle(point.x, point.y, 3);
        this.addChild(circle);
      }

      return new Promise<MapElement>((resolve, reject) => {
        setTimeout(() => {
          resolve(this);
        }, 500);
      });
    });
  }
}