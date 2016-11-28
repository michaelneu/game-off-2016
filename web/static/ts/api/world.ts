import { lobbies } from "./transport/server";

import { User } from "./user";
import { Device } from "./device";

export module World {
  interface RepositoryStructure {
    
  }

  export interface Repository {
    level: number;
    name: string;
    location_x: number;
    location_y: number;
    repo_structure: RepositoryStructure;
    github_id: number

    owner: User.Information;
    protection_device: Device.Information;

    repository_devices: Device.Information[];
  }

  export function getRepositories() : Promise<Repository[]> {
    return new Promise<Repository[]>((resolve, reject) => {
      setTimeout(() => {
        const points: Repository[] = [];

        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 10; y++) {
            points.push({
              location_x: x * 100 * Math.random(),
              location_y: y * 100 * Math.random(),
              name: "throws 'not implemented'",

              level: null,
              repo_structure: null,
              github_id: null,
              owner: null,
              protection_device: null,
              repository_devices: null
            });
          }
        }

        resolve(points);
      }, 500);
    });
  }
}