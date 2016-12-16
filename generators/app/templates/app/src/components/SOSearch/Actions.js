import defaultState from './State';

import {
  makeRequest,
  createDefaultFetchOption
} from '../../utils/fetch';

const LOAD = 'SOSearch/search';
const LOAD_SUCCESS = 'SOSearch/search/success';
const LOAD_FAIL = 'SOSearch/search/fail';

const load = (query) => {
  // Refer the fetch functions to understand the function signature.
  const options = createDefaultFetchOption(null, false, 'GET', false);
  const url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&intitle=' + query;
  return makeRequest(url, options, LOAD_SUCCESS, LOAD_FAIL, LOAD);
};

const isLoaded = (componentProps) => (
  componentProps.query && componentProps.questions
);

const sosearchReducer = (state = defaultState, action) => {
  switch (action.type) {

    case LOAD:
      return {
        ...state,
        data: { query: action.query, results: [] },
        loaded: false,
        loading: true
      };

    case LOAD_SUCCESS:
      return {
        ...state,
        data: { ...state.data, results: action.data.items },
        loaded: true,
        loading: false,
        error: null
      };

    case LOAD_FAIL:
      return {
        ...state,
        data: { ...state.data, results: [] },
        loaded: false,
        loading: false,
        error: action.error
      };

    default:
      return {...state};
  }
};

export default sosearchReducer;
export { isLoaded, load};
