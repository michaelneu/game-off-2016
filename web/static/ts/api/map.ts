export module Map {
  export interface Repository {
    x: number;
    y: number;
    name: string;
  }

  export function getRepositories() : Promise<Repository[]> {
    return new Promise<Repository[]>((resolve, reject) => {
      setTimeout(() => {
        const points: Repository[] = [];

        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 10; y++) {
            points.push({
              x: x * 100 * Math.random(),
              y: y * 100 * Math.random(),
              name: "foobar"
            });
          }
        }

        resolve(points);
      }, 500);
    });
  }
}