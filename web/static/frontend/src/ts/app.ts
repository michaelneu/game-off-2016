import API from "./api";
import { Socket } from "phoenix";

$(function () {
  const options: JQueryTerminalOptions = {
    greetings: "",
    prompt: "user@team [[;green;]repository/dir] $ ",
    exit: false
  };

 $(".terminal").terminal(function (command, terminal) {
   terminal.error(command);
 }, options);
});
