import { User } from "./api";
import Terminal from "./terminal";
import Canvas from "./canvas";
import PaperElement from "./paper";

$(function () {
  const terminal = new Terminal({
    greetings: "",
    prompt: "user@team [[;green;]repository/dir] $ ",
    exit: false
  });

  terminal.interpreter = (command: string, terminal: JQueryTerminal) => {
    switch (command) {
      case "whoami":
        User.getInformation().then((information) => {
          terminal.echo(information.name);
        });
        break;
    }
  };

  const canvas = new Canvas();
});
