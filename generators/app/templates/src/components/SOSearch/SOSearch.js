import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import { load as loadResults } from './Actions';
import SOQuestionsList from '../SOQuestionsList/SOQuestionsList';
import SOHot from '../SOHot/SOHot';

import {
  LOAD_REQUEST, DONE_REQUEST,
  FAILED_REQUEST
} from '../Layout/Actions';

class SOSearch extends React.Component {
  static propTypes = {
    query: React.PropTypes.string,
    questions: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    loaded: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool.isRequired
  };

  componentWillMount() {
    const { dispatch, query, loaded } = this.props;
    if (query !== '' && !loaded) {
      dispatch({type: LOAD_REQUEST});

      setTimeout(() => {
        dispatch(loadResults({ query: query })).then(() =>{
          dispatch({type: DONE_REQUEST});
        }, () => {
          dispatch({type: FAILED_REQUEST});
        });
      }, 10000);
    }
  }

  // IMPORTANT: Used when we show the same component with different props
  componentWillUpdate(next) {
    if (next.query && next.query !== '' && (next.query !== this.props.query)) {
      next.dispatch(loadResults(next.query));
    }
  }

  render() {
    const { dispatch, query, questions, loading } = this.props;
    return (
      <div>
        <div className="col-md-8">
          <h3>Search StackOverflow</h3>
          <p>
            Example Searches:
            <Link to="/sosearch/Hello">Hello</Link>&nbsp;
            <Link to="/sosearch/World">World</Link>&nbsp;
            <Link to="/sosearch/React">React</Link>&nbsp;
          </p>
          <input type="text" name="search" onChange={
            (e) => {
              e.preventDefault();
              dispatch(push('/sosearch/' + e.target.value));
            }
          } value={query} />
          {
            (loading) ?
              <p>Loading...</p>
            :
              <SOQuestionsList questions={questions} />
          }
        </div>
        <div className="col-md-4">
          <SOHot />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherObj) => {
  const newQuery = otherObj.params && otherObj.params.query ? otherObj.params.query : state.sosearch.data.query;
  return {...state.sosearch, questions: state.sosearch.data.results, query: newQuery};
};

export default connect(mapStateToProps)(SOSearch);
