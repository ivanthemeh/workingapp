import React, { Component } from 'react';
import Routes from '../routes';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import {
  inject,
  observer,
  Provider
} from 'mobx-react';



const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const stores = {
  // Key can be whatever you want
  routing: routingStore,
};

const history = syncHistoryWithStore(browserHistory, routingStore);

export default class Root extends Component<Props> {
  render() {
    // TODO: figure out how this works with no prop name... > at the end
    return (
      <Provider history={history} clientStore={this.props.stores[1]} scheduleStore={this.props.stores[2]} stores={this.props.stores} {...stores}>
        <Router history={history}>
            <div>
              <Routes/>
              {
                // console.log("Logging props", this.props)
              }
            </div>
        </Router>
      </Provider>
    );
  }
}
