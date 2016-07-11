import authConfigReducer from './Config/Actions';
import authIdentityReducer from './Identity/Actions';

import defaultState from './State';

const authReducer = (state = defaultState, action) => {
  if (action.type.match(/Config\//)) {
    return authConfigReducer(state, action);
  }
  if (action.type.match(/Role|User/)) {
    return authIdentityReducer(state, action);
  }
  return state;
};

export default authReducer;
