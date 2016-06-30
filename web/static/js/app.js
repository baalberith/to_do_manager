// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import $ from "jquery"

$('#complete_selected').click(function(){
  var tasks = $("input[name='tasks_to_complete[]']:checked").map(function () { return this.value; }).get();
  var path = $(location).attr('pathname') + '/tasks/complete_tasks';
  var csrf = $("meta[name=csrf]").attr('content');
  $.ajax({
    url: path,
    type: 'POST',
    data: { _csrf_token: csrf, _method: 'patch', tasks_to_complete: tasks }
  }).done( function (data) {
    window.location = data.location;
    $("#info").html(data.info);
  });
});

$('#delete_selected').click(function(){
  if (confirm("Are you sure?")) {
    var tasks = $("input[name='tasks_to_delete[]']:checked").map(function () { return this.value; }).get();
    var path = $(location).attr('pathname') + '/tasks/delete_tasks';
    var csrf = $("meta[name=csrf]").attr('content');
    $.ajax({
      url: path,
      type: 'POST',
      data: { _csrf_token: csrf, _method: 'delete', tasks_to_delete: tasks }
    }).done( function (data) {
      window.location = data.location;
      $("#info").html(data.info);
    });
  }
});

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
