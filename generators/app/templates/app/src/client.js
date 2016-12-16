/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import { Router, match, browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {compose, createStore, applyMiddleware} from 'redux';

import reducer from './reducer';
import routes from './routes';

/* ****************************************************************** */

// Create the store
let _finalCreateStore;
if (__DEVELOPMENT__) {
  const DevTools = require('./helpers/DevTools/DevTools');
  _finalCreateStore = compose(
    applyMiddleware(thunk, routerMiddleware(browserHistory), createLogger()),
    DevTools.instrument(),
    require('redux-devtools').persistState( window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  _finalCreateStore = compose(
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )(createStore);
}

const store = _finalCreateStore(reducer, window.__data);
const history = syncHistoryWithStore(browserHistory, store);

/* ****************************************************************** */

// Enable hot reloading
if (__DEVELOPMENT__ && module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(require('./reducer'));
  });
}
// FIXME: Required for replaying actions from devtools to work
// reduxSimpleRouterMiddleware.listenForReplays(store);

/* ****************************************************************** */

const dest = document.getElementById('content');
match({ history, routes: routes(history) }, (error, redirectLocation, renderProps) => {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <Router {...renderProps} />
    </Provider>
    , dest);
});

/* ****************************************************************** */

// FIXME: No idea what the hell seems to be going on here.

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  // FIXME:
  // if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
  //   console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  // }
}

// if (__DEVTOOLS__ && !window.devToolsExtension) {
//   ReactDOM.render(
//     <Provider store={store} key="provider">
//       <div>
//         {component}
//         <DevTools />
//       </div>
//     </Provider>,
//     dest
//   );
// }
