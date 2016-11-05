import API from "./api";

$(function () {
  var options = {
    greetings: "",
    prompt: "user@team [[;green;]repository/dir] $ ",
    exit: false
  };

  $(".terminal").terminal(function (command, terminal) {
    terminal.error(command);
  }, options);
});
