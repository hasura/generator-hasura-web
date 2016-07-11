/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import {Provider} from 'react-redux';
import {Router, browserHistory, Route, IndexRoute, IndexRedirect} from 'react-router';
import {routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {compose, createStore, applyMiddleware} from 'redux';

import {Login, Header, Unauthorized, Main, Home} from './components';
import {loadCredentials} from './components/Login/Actions';
import {loadCustomServices} from './components/Main/Actions';

// import {Data} from './components';

import {PageContainer, Schema, ViewTable, InsertItem, Manage,
  EditItem, AddExistingTable, AddExistingView, AddTable, ModifyTable} from './components/Services/Data'; // eslint-disable-line no-unused-vars
import CustomAdd from './components/Services/Custom/CustomAdd';
import {CSContainer, CSManage, CSConfigure} from './components/Services/CustomService';
import {loadSchema} from './components/Services/Data/DataActions';


import {PageContainer as AuthPageContainer, AuthManage} from './components/Services/Auth';
import {ListUsers, ManageUser, ManageRole, AddNewUser} from './components/Services/Auth/Identity';
import {ConfigAccount, ConfigEmail, ConfigMobile, ConfigGoogle, ConfigFacebook,
   ConfigLinkedin, ConfigRecaptcha} from './components/Services/Auth/Config';

import {getConfig as getAuthConfig} from './components/Services/Auth/Config/Actions';

// import {Advanced as AdvancedSettings} from './components/Advanced';

import reducer from './reducer';

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

const store = _finalCreateStore(reducer);
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

// Main routes and rendering
const requireLogin = (nextState, replaceState, cb) => {
  const {loginState: {credentials, userData}} = store.getState();
  if (credentials && userData) {
    const roles = credentials.hasura_roles;
    if (roles.find(r => (r === 'admin'))) {
      cb();
      return;
    }

    replaceState(null, '/unauthorized');
    cb();
    return;
  }
  store.dispatch(loadCredentials()).then(
    () => {
      const roles = store.getState().loginState.credentials.hasura_roles;
      if (roles.find(r => (r === 'admin'))) {
        store.dispatch(loadCustomServices()).then(
          () => {
            cb();
          },
          () => {
            alert('Could not fetch running services. Please try again.');
            // FIXME: This is not technically unauthorized
            replaceState(null, '/unauthorized');
            cb();
          });
      } else { // In case the role is not admin. Ask the user to logout
        replaceState(null, '/unauthorized');
        cb();
      }
    },
    () => {
      replaceState(null, '/login'); cb();
    }
  );
};

const requireSchema = (nextState, replaceState, cb) => {
  const {tables: {allSchemas} } = store.getState();
  if (allSchemas) {
    cb();
    return;
  }
  Promise.all([
    store.dispatch(loadSchema())
  ]).then(
    () => {
      cb();
    },
    () => {
      alert('Could not load schema.');
      replaceState(null, '/'); cb();
    }
  );
};


const requireAuthConfig = (nextState, replaceState, cb) => {
  /* if (allowedRoles) {
    cb();
    return;
  } */
  Promise.all([
    store.dispatch(getAuthConfig())
  ]).then(
    () => {
      cb();
    },
    () => {
      alert('Could not load auth config.');
      replaceState(null, '/'); cb();
    }
  );
};

const main = (
    <Router history={history}>
      <Route path="/login" component={Login} />
      <Route path="/" component={Header}>
        <Route path="unauthorized" component={Unauthorized} /> */}
        <Route path="" component={Main} onEnter={requireLogin}>
          <IndexRoute component={Home} />
          <Route path="data" onEnter={requireSchema} component={PageContainer}>
            <IndexRedirect to="schema" />
            <Route path="manage" component={Manage} />
            <Route path="schema" component={Schema} />
            <Route path="tables/add" component={AddTable} />
            <Route path="tables/existing-add" component={AddExistingTable} />
            <Route path="tables/view-add" component={AddExistingView} />
            <Route path="tables/:table/view" component={ViewTable} />
            <Route path="tables/:table/edit" component={EditItem} />
            <Route path="tables/:table/insert" component={InsertItem} />
            <Route path="tables/:table/modify" component={ModifyTable} />
          </Route>
          <Route path="custom/add" component={CustomAdd} />
          <Route path="custom/:service" component={CSContainer}>
            <IndexRedirect to="manage" />
            <Route path="manage" component={CSManage} />
            <Route path="configure" component={CSConfigure} />
          </Route>
          <Route path="auth" onEnter={requireAuthConfig} component={AuthPageContainer}>
            <IndexRedirect to="manage/users" />
            <Route path="manage" component={AuthManage} />
            <Route path="config/account" component={ConfigAccount}/>
            <Route path="config/email" component={ConfigEmail}/>
            <Route path="config/mobile" component={ConfigMobile}/>
            <Route path="config/google" component={ConfigGoogle}/>
            <Route path="config/facebook" component={ConfigFacebook}/>
            <Route path="config/linkedin" component={ConfigLinkedin}/>
            <Route path="config/recaptcha" component={ConfigRecaptcha}/>
            <Route path="manage/users" component={ListUsers}/>
            <Route path="manage/users/:id" component={ManageUser}/>
            <Route path="manage/user/new" component={AddNewUser}/>
            <Route path="manage/roles" component={ManageRole}/>
          </Route>
          { /* <Route path="advanced" component={AdvancedSettings}/> */ }
        </Route>
      </Route>
    </Router>
);

const dest = document.getElementById('content');
ReactDOM.render(
  <Provider store={store} key="provider">
    {main}
  </Provider>,
  dest
);

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
