import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { types, onSnapshot } from "mobx-state-tree";
import { createHashHistory } from 'history';

const history = createHashHistory();

const configureScheduleStore = () => {
  // declaring the shape of a node with the type `Schedule`
  const Schedule = types.model({
    id: types.number,
    title: types.string,
    done: false,
    assignee: types.string
  })
  .actions(self => {
    return {
      setTitle(title) {
        self.title = title
      }
    }
  })

  const ScheduleStore = types
    .model("ScheduleStore", { // 1
      loaded: types.boolean, // 2
      schedules: types.array(Schedule)  // 4
    })
    .views(self => {
      return {
        get completedSchedules() { // 6
          return self.schedules.filter(s => s.done)
        },
        get allSchedules() { // 6
          return self.schedules
        },
        findSchedulesByUser(user) { // 7
          return self.schedules.filter(s => s.assignee === user)
        },
        findScheduleById(id) { // 7
          return self.schedules.filter(s => s.id === id)
        }
      };
    })
    .actions(self => {
      return {
        addSchedule(schedule) {
          // TODO: work on this
          self.schedules.push(schedule)
        }
      };
    })


  const scheduleStore = ScheduleStore.create({
    loaded: true,
    schedules: [{ id: 12345, title: 'testing', done: false, assignee: 'Joe'}]
  });

  // listen to new snapshots
  onSnapshot(scheduleStore, (snapshot) => {
    console.log("logging snapshot::")
    console.dir(snapshot);
  })

  return scheduleStore;

}

// TODO: work on this for all the db and stuff in here..
export default {
  configureScheduleStore,
  history
};































// const Schedule = types.model("Schedule", {
//   title: types.string,
//   done: false
// }).actions(self => ({
//   toggle() {
//     self.done = !self.done
//   }
// }))

// const Store = types.model("Store", {
//   todos: types.array(Schedule)
// })


// export default Store;

// import { observer } from "mobx-react"


// const TodoView = observer(
//     class TodoView extends React.Component {
//         componentWillReact() {
//             console.log("I will re-render, since the todo has changed!")
//         }
//         render() {
//             return <div>{this.props.todo.title}</div>
//         }
//     }
// )

// export default TodoView;





// class Testing extends Component {

//     test = () => {
//         console.log("Logging info::", this.props);
//         console.log("Logging refs::", this.dataProvider);
//     }
//     render() {
//         return (
//             <div>
//                 <Button onClick={() => this.test()} variant="contained" color="primary" >
//                     Test
//                 </Button>
//                 <DataProvider ref={(ref) => this.dataProvider = ref}  />
//             </div>
//         )
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         dispatch: dispatch
//     }
// };

// export default connect(state => state, mapDispatchToProps)(Testing);
