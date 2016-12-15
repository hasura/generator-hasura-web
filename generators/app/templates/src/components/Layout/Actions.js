import defaultState from './State';

const LOAD_REQUEST = 'Layout/ONGOING_REQUEST';
const DONE_REQUEST = 'Layout/DONE_REQUEST';
const FAILED_REQUEST = 'Layout/FAILED_REQUEST';
const ERROR_REQUEST = 'Layout/ERROR_REQUEST';

const progressBarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        ongoingRequest: true,
        percent: 10,
        requestSuccess: null,
        requestError: null
      };

    case DONE_REQUEST:
      return {
        ...state,
        percent: 100,
        ongoingRequest: false,
        requestSuccess: true,
        requestError: null
      };

    case FAILED_REQUEST:
      return {
        ...state,
        percent: 100,
        ongoingRequest: false,
        requestSuccess: null,
        requestError: true
      };

    case ERROR_REQUEST:
      return {
        ...state,
        modalOpen: true,
        error: action.data,
        reqURL: action.url,
        reqData: action.params,
        statusCode: action.statusCode
      };

    default: return state;
  }
};

export default progressBarReducer;
export {LOAD_REQUEST, DONE_REQUEST, FAILED_REQUEST, ERROR_REQUEST};
