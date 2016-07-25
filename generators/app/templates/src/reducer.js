import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

// Load component reducers
import enternameReducer from './components/EnterName/Actions';
import sosearchReducer from './components/SOSearch/Actions';
import sohotReducer from './components/SOHot/Actions';

const reducer = combineReducers({
  entername: enternameReducer,
  sosearch: sosearchReducer,
  sohot: sohotReducer,
  routing: routerReducer
});

export default reducer;
