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

(function( $ ){
  $.fn.checkedValues = function() {
    return $.map( this, function (elem) {
      if (elem.checked) {
        return elem.value;
      }
    });
  }
})( $ );

$('#delete_selected').click(function(){
  var tasks = $(".tasks_to_delete").checkedValues();
  var path = $(location).attr('pathname') + '/tasks/delete_tasks';
  var csrf = $("meta[name=csrf]").attr('content');
  $.ajax({
    url: path,
    type: 'POST',
    data: { _csrf_token: csrf, _method: 'delete', tasks_to_delete: tasks },
    success: function (data) {
      window.location = data.location;
    }
  });
});

$('#complete_selected').click(function(){
  var tasks = $(".tasks_to_complete").checkedValues();
  var path = $(location).attr('pathname') + '/tasks/complete_tasks';
  var csrf = $("meta[name=csrf]").attr('content');
  $.ajax({
    url: path,
    type: 'POST',
    data: { _csrf_token: csrf, _method: 'patch', tasks_to_complete: tasks },
    success: function (data) {
      window.location = data.location;
    }
  });
});

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
