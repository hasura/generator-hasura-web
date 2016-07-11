/* State

{
  ongoingRequest : false, //true if request is going on
  lastError : null OR <string>
  lastSuccess: null OR <string>
}

*/
import defaultState from './HeaderState';
import Endpoints from '../../Endpoints';
import requestAction from '../../utils/requestAction';
import {globalCookiePolicy} from '../../Endpoints';
import {push} from 'react-router-redux';

const LOGOUT_REQUEST = 'Header/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'Header/LOGOUT_SUCCESS';

const logout = () => {
  return (dispatch) => {
    dispatch({type: LOGOUT_REQUEST});
    const url = Endpoints.logout;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    dispatch(requestAction(url, options, LOGOUT_SUCCESS))
      .then(() => dispatch(push('/login')));
  };
};

const headerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {...state, logoutRequest: true};
    case LOGOUT_SUCCESS:
      return {...state, logoutRequest: false};

    default: return state;
  }
};

export default headerReducer;
export {logout};
