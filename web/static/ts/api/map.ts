export module Map {
  export interface Point {
    x: number;
    y: number;
  }

  export function getPoints() : Promise<Point[]> {
    return new Promise<Point[]>((resolve, reject) => {
      setTimeout(() => {
        const points: Point[] = [];

        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 10; y++) {
            points.push({
              x: x * 100,
              y: y * 100
            });
          }
        }

        resolve(points);
      }, 500);
    });
  }
}