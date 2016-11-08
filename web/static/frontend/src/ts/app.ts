import { User } from "./api";

$(function () {
  const options: JQueryTerminalOptions = {
    greetings: "",
    prompt: "user@team [[;green;]repository/dir] $ ",
    exit: false
  };

  $(".terminal").terminal(function (command, terminal) {
    switch (command) {
      case "whoami":
        User.getInformation().then((information) => {
          terminal.echo(information.name);
        });
        break;
    }
  }, options);
});
