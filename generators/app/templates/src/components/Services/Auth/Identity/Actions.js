import defaultState from '../State';
import Endpoints, {globalCookiePolicy} from '../../../../Endpoints';
import requestAction from '../requestAction';
import _push from '../push';

const FETCH_USERS_SUCCESS = 'ListUsers/V_REQUEST_SUCCESS';
const FETCH_USERS_ERROR = 'ListUsers/V_REQUEST_ERROR';
const CURRENT_OFFSET = 'ListUsers/CURRENT_OFFSET';

const FETCH_USER_SUCCESS = 'ManageUser/ListUser/V_REQUEST_SUCCESS';
const FETCH_USER_ERROR = 'ManageUser/ListUser/V_REQUEST_ERROR';
const DEACTIVATE_USER_SUCCESS = 'ManageUser/Deactivate/V_REQUEST_SUCCESS';
const DEACTIVATE_USER_ERROR = 'ManageUser/Deactivate/V_REQUEST_ERROR';
const ACTIVATE_USER_SUCCESS = 'ManageUser/Activate/V_REQUEST_SUCCESS';
const ACTIVATE_USER_ERROR = 'ManageUser/Activate/V_REQUEST_ERROR';
const FETCH_ROLES_SUCCESS = 'ManageUser/Roles/V_REQUEST_SUCCESS';
const FETCH_ROLES_ERROR = 'ManageUser/Roles/V_REQUEST_ERROR';
const ASSIGN_ROLE_SUCCESS = 'ManageUser/AssignRole/V_REQUEST_SUCCESS';
const ASSIGN_ROLE_ERROR = 'ManageUser/AssignRole/V_REQUEST_ERROR';
const UNASSIGN_ROLE_SUCCESS = 'ManageUser/UnassignRole/V_REQUEST_SUCCESS';
const UNASSIGN_ROLE_ERROR = 'ManageUser/UnassignRole/V_REQUEST_ERROR';
const FORCE_LOGOUT_SUCCESS = 'ManageUser/ForceLogout/V_REQUEST_SUCCESS';
const FORCE_LOGOUT_ERROR = 'ManageUser/ForceLogout/V_REQUEST_ERROR';
const DELETE_USER_SUCCESS = 'ManageUser/DeleteUser/V_REQUEST_SUCCESS';
const DELETE_USER_ERROR = 'ManageUser/DeleteUser/V_REQUEST_ERROR';

const ADD_USER_SUCCESS = 'AddUser/V_REQUEST_SUCCESS';
const ADD_USER_ERROR = 'AddUser/V_REQUEST_ERROR';
const NEWUSER_UPDATE = 'AddUser/NewUserUpdate';

const DELETE_ROLE_SUCCESS = 'ManageRole/DeleteRole/V_REQUEST_SUCCESS';
const DELETE_ROLE_ERROR = 'ManageRole/DeleteRole/V_REQUEST_ERROR';
const ADD_ROLE_SUCCESS = 'ManageRole/AddRole/V_REQUEST_SUCCESS';
const ADD_ROLE_ERROR = 'ManageRole/AddRole/V_REQUEST_ERROR';

const ROUTE_CHANGED = '@@router/LOCATION_CHANGE';


const authIdentityReducer = (state = defaultState, action) => {  // eslint-disable-line no-unused-vars
  switch (action.type) {

    case ROUTE_CHANGED:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: '',
            text: ''
          }
        }
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          rows: action.data.users,
          totalRows: action.data.total
        }
      };

    case FETCH_USERS_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: 'Error! Could not load users from server. Please try again.'
          }
        }
      };

    case CURRENT_OFFSET:
      return {
        ...state,
        view: {
          ...state.view,
          currOffset: (action.data.currOffset <= 0) ? 0 : action.data.currOffset
        }
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: action.data
        }
      };

    case FETCH_USER_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case DEACTIVATE_USER_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: {
            ...state.view.currUserData,
            is_active: false
          }
        }
      };

    case DEACTIVATE_USER_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case ACTIVATE_USER_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: {
            ...state.view.currUserData,
            is_active: true
          }
        }
      };

    case ACTIVATE_USER_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case FETCH_ROLES_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          allowedRoles: action.data.roles
        }
      };

    case FETCH_ROLES_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: 'Error! Could not load data from server. Please try again.'
          }
        }
      };

    case ASSIGN_ROLE_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: action.data.user
        }
      };

    case ASSIGN_ROLE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case UNASSIGN_ROLE_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: action.data.user
        }
      };

    case UNASSIGN_ROLE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case FORCE_LOGOUT_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: {
            ...state.view.currUserData,
            active_sessions: []
          }
        }
      };

    case FORCE_LOGOUT_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          currUserData: {
            roles: []
          },
          currUser: null
        }
      };

    case DELETE_USER_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          newUser: {
            email: '',
            mobile: '',
            username: '',
            password: '',
            roles: []
          },
          currUser: action.data.user.id,
          currUserData: action.data.user,
          flashMessage: {
            type: '',
            text: ''
          }
        }
      };

    case ADD_USER_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case NEWUSER_UPDATE:
      return {
        ...state,
        view: {
          ...state.view,
          lastSuccess: {},
          newUser: action.data
        }
      };

    case DELETE_ROLE_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          allowedRoles: action.data.roles,
          flashMessage: {
            type: 'success',
            text: action.data.message
          }
        }
      };

    case DELETE_ROLE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          allowedRoles: action.data.roles,
          flashMessage: {
            type: 'success',
            text: action.data.message
          }
        }
      };

    case ADD_ROLE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: 'error',
            text: action.data.message
          }
        }
      };

    default:
      return state;
  }
  return state;
};


const getUser = (id) => {
  return (dispatch) => {
    const url = Endpoints.admin.user + '/' + id;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, FETCH_USER_SUCCESS, FETCH_USER_ERROR));
  };
};


const getUsers = () => {
  return (dispatch, getState) => {
    const state = getState();
    const limit = state.auth.view.limit;
    const offset = state.auth.view.currOffset;
    const url = Endpoints.admin.users + '?limit=' + limit + '&offset=' + offset;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, FETCH_USERS_SUCCESS, FETCH_USERS_ERROR));
  };
};

const deactivateUser = (userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.deactivateUser;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, DEACTIVATE_USER_SUCCESS, DEACTIVATE_USER_ERROR));
  };
};

const activateUser = (userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.activateUser;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, ACTIVATE_USER_SUCCESS, ACTIVATE_USER_ERROR));
  };
};

const getRoles = () => {
  return (dispatch) => {
    const url = Endpoints.admin.roles;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, FETCH_ROLES_SUCCESS, FETCH_ROLES_ERROR));
  };
};

const assignRole = (role, userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.assignRole;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId, 'role': role}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, ASSIGN_ROLE_SUCCESS, ASSIGN_ROLE_ERROR));
  };
};

const unassignRole = (role, userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.unassignRole;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId, 'role': role}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, UNASSIGN_ROLE_SUCCESS, UNASSIGN_ROLE_ERROR));
  };
};

const forceLogout = (userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.forceLogout;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, FORCE_LOGOUT_SUCCESS, FORCE_LOGOUT_ERROR));
  };
};

const deleteUser = (userId) => {
  return (dispatch) => {
    const url = Endpoints.admin.deleteUser;
    const options = {
      method: 'POST',
      body: JSON.stringify({'hasura_id': userId}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, DELETE_USER_SUCCESS, DELETE_USER_ERROR))
      .then(() => {
        dispatch(_push('/manage/users'));
      });
  };
};

const addUser = (data) => {
  return (dispatch, getState) => {
    const url = Endpoints.admin.newUser;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        'username': data.username,
        'email': data.email,
        'mobile': data.mobile,
        'password': data.password
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, ADD_USER_SUCCESS, ADD_USER_ERROR))
      .then(() => {
        dispatch(_push('/manage/users/' + getState().auth.view.currUser));
      });
  };
};

const deleteRole = (role) => {
  return (dispatch) => {
    const url = Endpoints.admin.deleteRole;
    const options = {
      method: 'POST',
      body: JSON.stringify({'role': role}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, DELETE_ROLE_SUCCESS, DELETE_ROLE_ERROR));
  };
};

const addRole = (role) => {
  return (dispatch) => {
    const url = Endpoints.admin.addRole;
    const options = {
      method: 'POST',
      body: JSON.stringify({'role': role}),
      headers: { 'Content-Type': 'application/json' },
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, ADD_ROLE_SUCCESS, ADD_ROLE_ERROR));
  };
};

export default authIdentityReducer;
export {getUsers, getUser, activateUser, deactivateUser, assignRole,
  unassignRole, getRoles, forceLogout, deleteUser, addUser, deleteRole,
  addRole, CURRENT_OFFSET, NEWUSER_UPDATE};
