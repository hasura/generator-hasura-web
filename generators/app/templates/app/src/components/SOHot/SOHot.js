import React from 'react';
import { connect } from 'react-redux';

import { load as loadResults } from './Actions';
import SOQuestionsList from '../SOQuestionsList/SOQuestionsList';

class SOHot extends React.Component {
  static propTypes = {
    questions: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    loaded: React.PropTypes.bool.isRequired
  };

  componentWillMount() {
    const { loaded, dispatch } = this.props;
    if (!loaded) {
      dispatch(loadResults());
    }
  }

  render() {
    const { questions } = this.props;
    return (
      <div>
        <h3>Hot on StackOverflow</h3>
        <SOQuestionsList questions={questions} highlightable uniquePrefix="sohot_" />
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    questions: state.sohot.data.results,
    loaded: state.sohot.loaded
  }
);

export default connect(mapStateToProps)(SOHot);
