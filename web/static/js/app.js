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
        <td><input data-number={this.props.value} onClick={this.props.onCompChbxClick} type="checkbox" name="to_complete[]" value={this.props.task.id} /></td>
        <td><input data-number={this.props.value} onClick={this.props.onDelChbxClick} type="checkbox" name="to_delete[]" value={this.props.task.id} /></td>
        <td>{this.props.task.name}</td>
        <td>{this.props.task.completed ? "Completed" : this.props.task.date}</td>
        <td className="text-right">
        <button data-number={this.props.value} onClick={this.props.onEditTask} name="task" value={this.props.task.id}> Edit </button>
        <button data-number={this.props.value} onClick={this.props.deleteTask} name="task" value={this.props.task.id}> Delete </button></td>
      </tr>
    )
  }
});

const NewTask = React.createClass({
  render() {
    return (
        <form onSubmit={this.props.toEdit ? this.props.editTask : this.props.addTask}>
        <table className="table"><thead><tr><th>Name</th><th>Due date</th><th></th></tr></thead><tbody><tr>
        <td><input onChange={this.props.onNameChange} type="text" name="name" value={this.props.task.name} />
        <span className="help-block">{this.props.errors.name}</span></td>
        <td><input onChange={this.props.onDateChange} type="date" name="date" value={this.props.task.date} /><span className="help-block">{this.props.errors.date}</span></td>
        <td className="text-right"><button>{this.props.toEdit ? "Edit task" : "Add task"}</button></td>
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
      errors: { name: '', date: '' },
      toEdit: undefined
    }
  },
  onNameChange(event) {
    this.setState({task: {name: event.target.value, date: this.state.task.date}});
  },
  onDateChange(event) {
    this.setState({task: {name: this.state.task.name, date: event.target.value}});
  },
  onCompChbxClick(event) {
    var taskIndex = parseInt(event.target.dataset.number, 10);
    if (this.state.tasks[taskIndex].toComplete == undefined) {
      this.state.tasks[taskIndex].toComplete = true;
    } else {
      this.state.tasks[taskIndex].toComplete = !(this.state.tasks[taskIndex].toComplete);
    }
    this.setState({tasks: this.state.tasks});
  },
  onDelChbxClick(event) {
    var taskIndex = parseInt(event.target.dataset.number, 10);
    if (this.state.tasks[taskIndex].toDelete == undefined) {
      this.state.tasks[taskIndex].toDelete = true;
    } else {
      this.state.tasks[taskIndex].toDelete = !(this.state.tasks[taskIndex].toDelete);
    }
    this.setState({tasks: this.state.tasks});
    console.log(this.state.tasks);
  },
  onEditTask(event) {
    var taskIndex = parseInt(event.target.dataset.number, 10);
    this.setState(
      {task: {
        name: this.state.tasks[taskIndex].name,
        date: this.state.tasks[taskIndex].date,
      },
       toEdit: {index: taskIndex, id: event.target.value}
      });
  },
  editTask(event) {
    console.log(this.state.toEdit);
    var path = $(location).attr('pathname') + '/tasks/' + this.state.toEdit.id;
    var csrf = $("meta[name=csrf]").attr('content');
    var newTask = {
      name: this.state.task.name,
      date: this.state.task.date,
      list_id: this.props.list.id,
      completed: false
    };
    $.ajax({
      url: path,
      type: 'POST',
      data: { _csrf_token: csrf, _method: "patch", task: newTask },
      success: function(data) {
        this.state.errors = { name: '', date: '' };
        if (data.valid) {
          this.state.tasks[this.state.toEdit.index] = {id: data.task.id, name: data.task.name, date: data.task.date }
          this.setState({
            tasks: this.state.tasks,
            task: { name: '', date: '' },
            toEdit: undefined
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
  deleteTask(event) {
    var taskIndex = parseInt(event.target.dataset.number, 10);
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
    console.log(event.target);
    var path = $(location).attr('pathname') + '/tasks';
    var csrf = $("meta[name=csrf]").attr('content');
    var newTask = {
      name: this.state.task.name,
      date: this.state.task.date,
      list_id: this.props.list.id,
      completed: false
    };
    $.ajax({
      url: path,
      type: 'POST',
      data: { _csrf_token: csrf, task: newTask },
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
  completeSelectedTasks() {
    var tasksToComplete = [];
    var tasksNumbers = [];
    for (var taskIndex = 0; taskIndex < this.state.tasks.length; taskIndex++) {
      if (this.state.tasks[taskIndex].toComplete && !(this.state.tasks[taskIndex].completed)) {
        tasksToComplete.push(this.state.tasks[taskIndex].id);
        tasksNumbers.push(taskIndex);
      }
    }
    var path = $(location).attr('pathname') + '/tasks/complete_tasks';
    var csrf = $("meta[name=csrf]").attr('content');
    $.ajax({
      url: path,
      type: 'POST',
      data: { _csrf_token: csrf, _method: 'patch', tasks_to_complete: tasksToComplete },
      success: function(data) {
        for (let taskIndex of tasksNumbers) {
          this.state.tasks[taskIndex].completed = true;
          this.state.tasks[taskIndex].toComplete = true;
          this.setState({ tasks: this.state.tasks });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Can't complete selected tasks.");
      }.bind(this)
    });
    event.preventDefault();
  },
  deleteSelectedTasks() {
    if (confirm("Are you sure?")) {
      var tasksToDelete = [];
      var tasksNumbers = [];
      for (var taskIndex = 0; taskIndex < this.state.tasks.length; taskIndex++) {
        if (this.state.tasks[taskIndex].toDelete) {
          tasksToDelete.push(this.state.tasks[taskIndex].id);
          tasksNumbers.push(taskIndex);
        }
      }
      var path = $(location).attr('pathname') + '/tasks/delete_tasks';
      var csrf = $("meta[name=csrf]").attr('content');
      $.ajax({
        url: path,
        type: 'POST',
        data: { _csrf_token: csrf, _method: 'delete', tasks_to_delete: tasksToDelete },
        success: function(data) {
          for (var i = tasksNumbers.length - 1; i >= 0; i--) {
            this.state.tasks.splice(tasksNumbers[i], 1);
            this.setState({ tasks: this.state.tasks });
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("Can't delete selected tasks.");
        }.bind(this)
      });
    }
    event.preventDefault();
  },
  render() {
    return (
      <div>
      <table key={this.props.list.id} className="table">
        <caption>{this.props.list.name}</caption>
        <thead><tr><th>Complete</th><th>Delete</th><th>Task</th><th>Due date</th><th></th></tr></thead>
        <tfoot><tr>
        <td>{this.state.tasks.length > 0 ? <button onClick={this.completeSelectedTasks}>✓</button> : ""}</td>
        <td>{this.state.tasks.length > 0 ? <button onClick={this.deleteSelectedTasks}>✓</button> : ""}</td>
        <td></td><td></td><td></td></tr></tfoot>
        <tbody>
        {this.state.tasks.map(function(task, taskIndex) {
          return <Task key={task.id} task={task} value={taskIndex} deleteTask={this.deleteTask} onEditTask={this.onEditTask} onCompChbxClick={this.onCompChbxClick} onDelChbxClick={this.onDelChbxClick} />
          }.bind(this))}
        </tbody>
      </table>
        <NewTask addTask={this.addTask} editTask={this.editTask} onNameChange={this.onNameChange} onDateChange={this.onDateChange} task={this.state.task} errors={this.state.errors} toEdit={this.state.toEdit} /></div>
    )
  }
});

var listProps = $("#list-props").attr("data-props");
if (listProps) {
  ReactDOM.render(
    <ListApp list={JSON.parse(listProps)} />, $("#list-component")[0])
}

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
