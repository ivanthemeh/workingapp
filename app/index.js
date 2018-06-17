import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import './app.global.scss';
import { createHashHistory } from 'history';
import connectToDbSetupChanges from './store/connectDbsToStores';
import configureUserStore from './store/configureUserStore';
import configureClientStore from './store/configureClientStore';
import { configureScheduleStore } from './store/configureScheduleStore';
const history = createHashHistory();

// fix this change to setup for feeds NOT DONE YET
let scheduleStore = configureScheduleStore();

let clientStore = configureClientStore([]);
let userStore = configureUserStore([]);

let stores = [userStore, clientStore];
connectToDbSetupChanges(stores);

render(
  <AppContainer>
    <Root stores={stores} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
