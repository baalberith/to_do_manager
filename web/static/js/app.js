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
        <td>{this.props.task.date}</td>
        <td className="text-right"><button id={this.props.value} onClick={this.props.deleteTask} name="task" value={this.props.task.id}> Delete </button></td>
      </tr>
    )
  }
});

const NewTask = React.createClass({
  render() {
    return (
        <form onSubmit={this.props.addTask}>
        <table className="table"><tbody><tr>
        <td><input onChange={this.props.onNameChange} type="text" name="name" value={this.props.task.name} />
        <span className="help-block">{this.props.errors.name}</span></td>
        <td><input onChange={this.props.onDateChange} type="date" name="date" value={this.props.task.date} /><span className="help-block">{this.props.errors.date}</span></td>
        <td className="text-right"><button>Add task</button></td>
        </tr></tbody></table>
        </form>
    );
  }
});

const ListApp = React.createClass({
  getInitialState() {
    return {
      tasks: this.props.list.tasks,
      task: { name: '', date: '' },
      errors: { name: '', date: '' }
    }
  },
  onNameChange(event) {
    this.setState({task: {name: event.target.value, date: this.state.task.date}});
  },
  onDateChange(event) {
    this.setState({task: {name: this.state.task.name, date: event.target.value}});
  },
  deleteTask(event) {
    var taskIndex = parseInt(event.target.id, 10);
    if (confirm("Are you sure?")) {
      var path = $(location).attr('pathname') + '/tasks/' + event.target.value;
      var csrf = $("meta[name=csrf]").attr('content');
      $.ajax({
        url: path,
        type: 'POST',
        data: { _csrf_token: csrf, _method: 'delete' },
        success: function(data) {
          this.setState(function(state) {
            state.tasks.splice(taskIndex, 1);
            return { tasks: state.tasks };
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("Can't delete");
        }.bind(this)
      });
    }
  },
  addTask(event) {
    var path = $(location).attr('pathname') + '/tasks';
    var csrf = $("meta[name=csrf]").attr('content');
    var new_task = {
      name: this.state.task.name,
      date: this.state.task.date,
      list_id: this.props.list.id,
      completed: false
    };
    $.ajax({
      url: path,
      type: 'POST',
      data: { _csrf_token: csrf, task: new_task },
      success: function(data) {
        this.state.errors = { name: '', date: '' };
        if (data.valid) {
          this.setState({
            tasks: this.state.tasks.concat([{id: data.task.id, name: data.task.name, date: data.task.date }]),
            task: { name: '', date: '' }
          });
        } else {
          for (let error of data.errors) {
            var value = this.state.errors[error.field];
            this.state.errors[error.field] = value + "\n" + error.detail;
          }
          this.setState({
            errors: this.state.errors
          })
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Can't create new task.");
      }.bind(this)
    });
    event.preventDefault();
  },
  render() {
    return (
      <div>
      <table key={this.props.list.id} className="table">
        <caption>{this.props.list.name}</caption>
        <thead><tr><th>Task</th><th>Due date</th><th></th></tr></thead>
        <tbody>
        {this.state.tasks.map(function(task, taskIndex) {
          return <Task key={task.id} task={task} value={taskIndex} deleteTask={this.deleteTask} />
          }.bind(this))}
        </tbody>
      </table>
        <NewTask addTask={this.addTask} onNameChange={this.onNameChange} onDateChange={this.onDateChange} task={this.state.task} errors={this.state.errors} /></div>
    )
  }
});


var list_props = $("#list-props").attr("data-props");
if (list_props) {
  ReactDOM.render(
      <ListApp list={JSON.parse(list_props)} />, $("#list-component")[0])
}


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
