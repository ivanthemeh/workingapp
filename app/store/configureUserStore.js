import React, { Component } from 'react';
import { types, onSnapshot } from "mobx-state-tree";

const configureUserStore = (initialUsers) => {

  const User = types
  .model("User", {
    id: types.string,
    email: types.string,
    name: types.string,
    password: types.string
  })

  const UserStore = types
    .model("UserStore", {
      table: types.string,
      loaded: types.boolean,
      // TODO: work on fixing this to an object..
      currentUser: types.maybe(User),
      users: types.array(User)
    })
    .views(self => {
      return {
        get allUsers() { // 6
          return self.users
        },
        findUserById(id) { // 7
          return self.users.filter(u => u.id === id)
        },
        findUserByEmail(email) { // 7
          return self.users.filter(u => u.email === email)
        }
      };
    })
    .actions(self => {
      return {
        setInitialData(users) {
          // TODO: check to see if i can remove logs..
          console.log("logging users in set initial action::", users);
          self.users = users
        },
        removeById(id) {
          return self.users = self.clients.filter(u => u.id !== id);
        },
        insert(user) {
          return self.users.push(user);
        },
        update(user) {
          const index = self.users.findIndex(u => u.id === user.id);
          self.users[index] = user;
          return self.users;
        },
        setCurrentUser(user) {
          console.log("Current User Set::", user);
          self.currentUser = user;
        }
      };
    })

  const userStore = UserStore.create({
    table: 'users',
    loaded: false,
    currentUser: null,
    users: initialUsers
  });

  // listen to new snapshots
  onSnapshot(userStore, (snapshot) => {
    console.log("logging snapshot in user store::")
    console.dir(snapshot);
  })

  return userStore;

}

export default configureUserStore;































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
