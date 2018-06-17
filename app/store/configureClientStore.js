import React, { Component } from 'react';
import { types, onSnapshot } from "mobx-state-tree";

const configureClientStore = (initialClients) => {

  const Client = types
  .model("Client", {
    id: types.string,
    email: types.string,
    name: types.string
  })
  .actions(self => {
    return {
      updateEmail(email) {
        self.email = email;
      }
    }
  })

  const ClientStore = types
    .model("ClientStore", {
      table: types.string,
      loaded: types.boolean,
      clients: types.array(Client)
    })
    .views(self => {
      return {
        get allClients() {
          return self.clients
        },
        findClientById(id) {
          let client = self.clients.filter(c => c.id === id);
          console.log(client);
          return client;
        }
      };
    })
    .actions(self => {
      return {
        setInitialData(clients) {
          console.log("logging clients in set initial action::", clients)
          self.clients = clients
        },
        removeById(id) {
          return self.clients = self.clients.filter(c => c.id !== id);
        },
        insert(client) {
          return self.clients.push(client);
        },
        update(client) {
          const index = self.clients.findIndex(c => c.id === client.id);
          self.clients[index] = client;
          console.log(self.clients);
          return self.clients;
        }
      };
    })

  const clientStore = ClientStore.create({
    table: 'clients',
    loaded: false,
    clients: initialClients
  });

  // listen to new snapshots
  onSnapshot(clientStore, (snapshot) => {
    console.log("logging snapshot in client store::")
    console.dir(snapshot);
  })

  return clientStore;

}

export default configureClientStore;































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
