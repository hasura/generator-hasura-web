import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

// Load component reducers
import enternameReducer from './components/EnterName/Actions';
import sosearchReducer from './components/SOSearch/Actions';

const reducer = combineReducers({
  entername: enternameReducer,
  sosearch: sosearchReducer,
  routing: routerReducer,
  reduxAsyncConnect,
});

export default reducer;
