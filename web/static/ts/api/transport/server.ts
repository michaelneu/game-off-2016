import { Socket } from "phoenix";

declare var GAMEOFF_JWT_TOKEN: string;

const socket = new Socket("/socket");

socket.connect({
  guardian_token: GAMEOFF_JWT_TOKEN
});

const lobby = socket.channel("repo:lobby");
lobby.join();

export function send<T, TResult>(event: string, payload?: T) : Promise<TResult> {
  return new Promise<TResult>((resolve, reject) => {
    lobby.push(event, payload)
          .receive("ok", (response: TResult) => {
            resolve(response);
          })
          .receive("error", (response) => {
            reject(response);
          });
  });
}

export function addEventListener<TResult>(event: string, callback: (data?: TResult) => void) : void {
  lobby.on(event, callback);
}

export function removeEventListener(event: string) : void {
  lobby.off(event);
}
