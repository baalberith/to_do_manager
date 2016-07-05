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
import React from "react"
import ReactDOM from "react-dom"

const Task = React.createClass({
  render() {
    return (
      <tr>
        <td>{this.props.task.name}</td>
        <td className="text-right"><button id={this.props.value} onClick={this.props.deleteTask} name="task" value={this.props.task.id}> Delete </button></td>
      </tr>
    )
  }
});

const List = React.createClass({
  getInitialState() {
    return {
      tasks: this.props.tasks,
    }
  },
  deleteTask(event) {
    console.log(event.target.id);
    if (confirm("Are you sure?")) {
      var path = $(location).attr('pathname') + '/tasks/' + event.target.value;
      var csrf = $("meta[name=csrf]").attr('content');
      $.ajax({
        url: path,
        type: 'POST',
        data: { _csrf_token: csrf, _method: 'delete' }
      }).done( function (data) {

      });
    }

    var taskIndex = parseInt(event.target.id, 10);
    this.setState(function(state) {
      state.tasks.splice(taskIndex, 1);
      return { tasks: state.tasks };
    });
  },
  render() {
    return (
      <table key={this.props.id} className="table">
        <caption>{this.props.name}</caption>
        <thead><tr><th>Task</th><th></th></tr></thead>
        <tbody>
        {this.state.tasks.map(function(task, taskIndex) {
          return <Task key={task.id} task={task} value={taskIndex} deleteTask={this.deleteTask} />
          }.bind(this))}
        </tbody>
      </table>
    )
  }
});

var list_props = $("#list-props").attr("data-props");
if (list_props) {
  var data = JSON.parse(list_props);
  console.log(data);

  ReactDOM.render(
      <List name={data.name} tasks={data.tasks} />, $("#list-component")[0])
}

// const { string } = React.PropTypes

// const HelloWorld = React.createClass({

//   propTypes: {
//     message: string.isRequired
//   },

//   getDefaultProps() {
//     return {
//       message: "The default message"
//     }
//   },

//   render() {
//     const { message } = this.props

//     return (
//         <p>{message}</p>
//     )
//   }
// })

// $('#complete_selected').click(function(){
//   var tasks = $("input[name='tasks_to_complete[]']:checked").map(function () { return this.value; }).get();
//   var path = $(location).attr('pathname') + '/tasks/complete_tasks';
//   var csrf = $("meta[name=csrf]").attr('content');
//   $.ajax({
//     url: path,
//     type: 'POST',
//     data: { _csrf_token: csrf, _method: 'patch', tasks_to_complete: tasks }
//   }).done( function (data) {
//     // window.location = data.location;
//     $(location).attr('pathname', data.location);
//     $("#info").html(data.info);
//   });
// });

// $('#delete_selected').click(function(){
//   if (confirm("Are you sure?")) {
//     var tasks = $("input[name='tasks_to_delete[]']:checked").map(function () { return this.value; }).get();
//     var path = $(location).attr('pathname') + '/tasks/delete_tasks';
//     var csrf = $("meta[name=csrf]").attr('content');
//     $.ajax({
//       url: path,
//       type: 'POST',
//       data: { _csrf_token: csrf, _method: 'delete', tasks_to_delete: tasks }
//     }).done( function (data) {
//       // window.location = data.location;
//       $(location).attr('pathname', data.location);
//       $("#info").html(data.info);
//     });
//   }
// });

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
