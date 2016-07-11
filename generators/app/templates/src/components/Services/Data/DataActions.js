/* State

{
  ongoingRequest : false, //true if request is going on
  lastError : null OR <string>
  userColumns: []
  users: [ {} ]
}

*/

import defaultState from './DataState';
import Endpoints, {globalCookiePolicy} from '../../../Endpoints';
import insertReducer from './InsertActions';
import viewReducer from './ViewActions';
import editReducer from './EditActions';
import modifyReducer from './ModifyActions';

const SET_TABLE = 'Data/SET_TABLE';
const LOAD_SCHEMA = 'Data/LOAD_SCHEMA';

/* ************ action creators ************************/
const loadSchema = () => {
  return (dispatch) => {
    const p1 = new Promise((resolve, reject) => {
      fetch(Endpoints.getSchema, {credentials: globalCookiePolicy}).then(
        (response) => {
          if (response.ok) {
            response.json().then(
              (allSchemas) => {
                dispatch({type: LOAD_SCHEMA, allSchemas});
                resolve();
              },
              () => { reject(); }
            );
          } else {
            console.error('Could not load schema! Are you logged in?');
            reject();
          }
        },
        (error) => {
          console.error('Could not load schema! Are you logged in?');
          console.log(error);
          reject();
        });
    });
    return p1;
  };
};
const setTable = (tableName) => ({type: SET_TABLE, tableName});

/* ********************************************************/
const dataReducer = (state = defaultState, action) => { // eslint-disable-line no-unused-vars
  if (action.type.indexOf('ViewTable/') === 0) {
    return {
      ...state,
      view: viewReducer(state.currentTable, state.allSchemas, state.view, action)
    };
  }
  if (action.type.indexOf('ModifyTable/') === 0) {
    return {
      ...state,
      modify: modifyReducer(state.currentTable, state.allSchemas, state.modify, action)
    };
  }
  if (action.type.indexOf('InsertItem/') === 0) {
    return {
      ...state,
      insert: insertReducer(state.currentTable, state.insert, action)
    };
  }
  if (action.type.indexOf('EditItem/') === 0) {
    return {
      ...state,
      update: editReducer(state.currentTable, state.update, action)
    };
  }
  switch (action.type) {
    case LOAD_SCHEMA:
      return {...state, allSchemas: action.allSchemas};
    case SET_TABLE:
      return {...state, currentTable: action.tableName};
    default:
      return state;
  }
  return state;
};

export default dataReducer;
export {setTable, loadSchema};
