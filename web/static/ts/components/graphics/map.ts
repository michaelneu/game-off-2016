import { Map } from "../../api/map";

import Color from "./color";
import PaperElement from "./paper";
import Polygon from "./polygon";

import Voronoi = require("voronoi");

export default class MapElement extends createjs.Container {
  constructor() {
    super();
  }

  public show(width: number, height: number, animationDuration: number = 700) : Promise<MapElement> {
    const mapPadding = 100;

    return Map.getRepositories().then((repositories) => {
      const repoBorders = this.getBorderPointsOfPointList(repositories),
            voronoi = new Voronoi();

      const diagram = voronoi.compute(repositories, {
        xl: repoBorders.topLeft.x - 25,
        yt: repoBorders.topLeft.y - 25,
        xr: repoBorders.bottomRight.x + 25,
        yb: repoBorders.bottomRight.y + 25
      });

      const diagramBorders = this.getBorderPointsOfPointList(diagram.edges.map((edge) => [edge.va, edge.vb])
                                                                          .reduce((a, b) => a.concat(b), [])),
            diagramWidth = diagramBorders.bottomRight.x - diagramBorders.topLeft.x,
            diagramHeight = diagramBorders.bottomRight.y - diagramBorders.topLeft.y;
      
      for (const cell of diagram.cells) {
        const points = this.convertVoronoiCellToVertexArray(cell),
              scaledPoints = points.map((point) => {
                return {
                  x: (point.x - diagramBorders.topLeft.x) / diagramWidth * (width - 2 * mapPadding),
                  y: (point.y - diagramBorders.topLeft.y) / diagramHeight * (height - 2 * mapPadding)
                };
              });

        if (scaledPoints.length > 0) {
          const polygon = new Polygon(scaledPoints);

          polygon.stroke = "rgba(0, 0, 0, 0.3)";
          polygon.fill = "lightgreen";
          polygon.cursor = "pointer";

          polygon.on("click", () => {
            const event = new createjs.Event("selection", false, false);
            event.data = cell.site;

            this.dispatchEvent(event);
          });

          polygon.rotation = 30 * Math.random();
          polygon.x = 750 * Math.random() - 375;
          polygon.y = 750 * Math.random() - 375;

          this.addChild(polygon);

          createjs.Tween.get(polygon).to({
            alpha: 1,
            rotation: 0,
            x: mapPadding,
            y: mapPadding
          }, animationDuration * 0.9, createjs.Ease.elasticOut);
        }
      }

      return new Promise<MapElement>((resolve, reject) => {
        setTimeout(() => {
          resolve(this);
        }, animationDuration);
      });
    });
  }

  public hide(duration: number = 750) : Promise<MapElement> {
    const windowHeight = $(window).height();

    for (const child of this.children) {
      createjs.Tween.get(child).to({
        y: windowHeight + 150 * Math.random(),
        rotation: 30 * Math.random() - 15
      }, duration * 0.9, createjs.Ease.quadIn);
    }

    return new Promise<MapElement>((resolve, reject) => {
      setTimeout(() => {
        this.removeAllChildren();

        resolve(this);
      }, duration);
    });
  }

  private euclideanDistanceBetween(a: Voronoi.Vertex, b: Voronoi.Vertex) : number {
    const diffX = b.x - a.x,
          diffY = b.y - a.y;

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  private getBorderPointsOfPointList(points: Voronoi.Vertex[]) : { topLeft: Voronoi.Vertex, bottomRight: Voronoi.Vertex } {
    const infinityValue = 1e10,
          minusInfinity = {
            x: -infinityValue,
            y: -infinityValue
          },
          plusInfinity = {
            x: infinityValue,
            y: infinityValue
          };

    let bottomRightPoint = points[0],
        topLeftPoint = points[0];

    for (const repo of points) {
      const repoDistanceToMinusInf = this.euclideanDistanceBetween(repo, minusInfinity),
            repoDistanceToPlusInf = this.euclideanDistanceBetween(repo, plusInfinity);
      
      const topLeftDistanceToMinusInf = this.euclideanDistanceBetween(topLeftPoint, minusInfinity),
            bottomRightDistanceToPlusInf = this.euclideanDistanceBetween(bottomRightPoint, plusInfinity);

      if (repoDistanceToMinusInf < topLeftDistanceToMinusInf) {
        topLeftPoint = repo;
      } else if (repoDistanceToPlusInf < bottomRightDistanceToPlusInf) {
        bottomRightPoint = repo;
      }
    }

    return {
      topLeft: topLeftPoint,
      bottomRight: bottomRightPoint
    };
  }

  private convertVoronoiCellToVertexArray(cell: Voronoi.Cell) : Voronoi.Vertex[] {
    const points = [];

    for (let i = 0; i < cell.halfedges.length; i++) {
      const edge = cell.halfedges[i];
      
      if (i == 0) {
        points.push(edge.getStartpoint());
        points.push(edge.getEndpoint());
      } else {
        points.push(edge.getEndpoint());
      }
    }

    return points;
  }
}