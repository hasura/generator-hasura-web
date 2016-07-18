import defaultState from './State';

const SUBMIT = 'EnterName/onSubmit';

const onNameSubmit = (input) => ({type: SUBMIT, name: input});

const enternameReducer = (state = defaultState, action) => {
  switch (action.type) {

    case SUBMIT:
      return {...state, name: action.name};

    default:
      return {...state};
  }
};

export default enternameReducer;
export {onNameSubmit};
