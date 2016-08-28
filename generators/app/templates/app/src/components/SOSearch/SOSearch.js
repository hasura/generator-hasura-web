import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import { load as loadResults } from './Actions';
import SOQuestionsList from '../SOQuestionsList/SOQuestionsList';
import SOHot from '../SOHot/SOHot';

class SOSearch extends React.Component {
  static propTypes = {
    query: React.PropTypes.string.isRequired,
    questions: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    loaded: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool.isRequired
  };

  componentWillMount() {
    const { dispatch, query, loaded } = this.props;
    if (query !== '' && !loaded) {
      // Remember to make it into an object
      dispatch(loadResults({ query: query }));
    }
  }

  // IMPORTANT: Used when we show the same component with different props
  componentWillUpdate(next) {
    if (next.query !== '' && (next.query !== this.props.query)) {
      next.dispatch(loadResults({ query: next.query }));
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
            <Link to="/sosearch/Hello">Hello</Link>
            <Link to="/sosearch/World">World</Link>
            <Link to="/sosearch/React">React</Link>
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

const mapStateToProps = (state, ownProps) => (
  {
    query: ownProps.params ? ownProps.params.query : state.sosearch.data.query,
    questions: state.sosearch.data.results,
    loaded: state.sosearch.loaded,
    loading: state.sosearch.loading || false
  }
);

export default connect(mapStateToProps)(SOSearch);
