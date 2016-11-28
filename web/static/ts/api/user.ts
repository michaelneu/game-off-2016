import { Lobby } from "./transport/server";

export module User {
  export interface Information {
    name?: string;
    team?: string;
  }

  export function getInformation() : Promise<Information> {
    // return Server.send<string, Information>("user");
    return null;
  }
}