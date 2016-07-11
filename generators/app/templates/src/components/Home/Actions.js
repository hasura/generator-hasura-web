import defaultState from './State';

const EXPAND = 'Home/EXPAND';

const expandToggle = (stepName) => ({type: EXPAND, stepName});

const homeReducer = (state = defaultState, action) => {
  switch (action.type) {

    case EXPAND:
      const newState = {...defaultState};
      newState[action.stepName] = !state[action.stepName];
      return newState;

    default:
      return {...state};
  }
};

export default homeReducer;
export {expandToggle};
