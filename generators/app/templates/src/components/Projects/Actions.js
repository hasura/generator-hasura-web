import defaultState from './State';
import Endpoints, {globalCookiePolicy} from '../../Endpoints';
import requestAction from './requestAction';
import {push} from 'react-router-redux';

const SET_PROJECTS = 'Projects/SET_PROJECTS';
const REQUEST_ERROR = 'Projects/REQUEST_ERROR';
const LOGOUT_REQUEST = 'Projects/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'Projects/LOGOUT_SUCCESS';

const initializeProjects = () => {
  return (dispatch) => {
    const url = Endpoints.getProjects;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, SET_PROJECTS, REQUEST_ERROR));
  };
};

const logout = () => {
  return (dispatch) => {
    dispatch({type: LOGOUT_REQUEST});
    const url = Endpoints.logout;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    dispatch(requestAction(url, options, LOGOUT_SUCCESS)).
      then(() => dispatch(push('/login')));
  };
};

const projectReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {...state, logoutRequest: true};
    case LOGOUT_SUCCESS:
      return {...state, logoutRequest: false};
    case SET_PROJECTS:
      return {...state, projects: action.data};
    default:
      return state;
  }
};

export default projectReducer;
export {initializeProjects, logout};
