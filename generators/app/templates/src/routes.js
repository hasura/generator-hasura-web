import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';

// Load components
import { Layout, Example, SOSearch, NotFound } from './components';

// Main routes
const routes = (history) => {
  return (
    <Router history={history}>
      {/* Show header component on all pages of it's child. */}
      <Route path="/" component={Layout}>
        <IndexRoute component={Example}/>
        <Route path="sosearch/:query" component={SOSearch}/>
      </Route>
      <Route path="*" component={NotFound}/>
    </Router>
  );
};

export default routes;
