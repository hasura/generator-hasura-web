import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import {load as loadResults} from './components/SOSearch/Actions';
import {load as loadHot} from './components/SOHot/Actions';

// Load components
import { Layout, Example, SOSearch, NotFound } from './components';

// Main routes
const routes = (history) => {
  return (
    <Router history={history}>
      {/* Show header component on all pages of it's child. */}
      <Route path="/" component={Layout} serverDispatch={[loadHot]}>
        <IndexRoute component={Example}/>
        <Route path="sosearch/:query" component={SOSearch} serverDispatch={[loadResults]}/>
      </Route>
      {/* Any route with path = "*" is set a 404 response on server rendering. */}
      <Route path="*" component={NotFound}/>
    </Router>
  );
};

export default routes;
