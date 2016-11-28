import { Socket, Channel } from "phoenix";

declare var GAMEOFF_JWT_TOKEN: string;

const socket = new Socket("/socket");

socket.connect({
  guardian_token: GAMEOFF_JWT_TOKEN
});

export class Lobby {
  private channel: Channel;

  constructor(identifier: string) {
    this.channel = socket.channel(identifier);
  }

  public join() : void {
    this.channel.join();
  }

  public leave() : void {
    this.channel.leave();
  }

  public send<T, TResult>(event: string, payload?: T) : Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      this.channel.push(event, payload)
            .receive("ok", (response: TResult) => {
              resolve(response);
            })
            .receive("error", (response) => {
              reject(response);
            });
    });
  }

  public addEventListener<TResult>(event: string, callback: (data?: TResult) => void) : void {
    this.channel.on(event, callback);
  }

  public removeEventListener(event: string) : void {
    this.channel.off(event);
  }
}

export const lobbies = {
  world: new Lobby("world:lobby")
};