import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';

import { isLoaded, load as loadResults } from './Actions';
import SOQuestionsList from '../SOQuestionsList/SOQuestionsList';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}, params: {query}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadResults(query));
    }
  }
}])
@connect(
  (state, ownProps) => {
    return {
      query: ownProps.params ? ownProps.params.query : state.sosearch.data.query,
      questions: state.sosearch.data.results,
      loading: state.sosearch.loading
    };
  }
)
export default class SOSearch extends React.Component {
  static propTypes = {
    query: React.PropTypes.string.isRequired,
    questions: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  render() {
    const { dispatch, query, questions } = this.props;
    return (
      <div>
        <h3>Search StackOverflow</h3>
        <input type="text" name="search" onChange={
          (e) => {
            e.preventDefault();
            dispatch(push('/sosearch/' + e.target.value));
            dispatch(loadResults(e.target.value));
          }
        } value={query} />
        <SOQuestionsList questions={questions} />
      </div>
    );
  }
}
