import React from 'react';
import { connect } from 'react-redux';

import { toggleHighlight } from './Actions';
import SOQuestion from '../SOQuestion/SOQuestion';

class SOQHighlightable extends React.Component {
  static propTypes = {
    question: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      link: React.PropTypes.string.isRequired
    }).isRequired,
    unique: React.PropTypes.string.isRequired,
    highlighted: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired
  };

  render() {
    const { question, dispatch, unique, highlighted } = this.props;

    return (
      <div style={ (highlighted) ? {backgroundColor: 'yellow'} : {} }>
        <SOQuestion question={question}/>
        <a onClick={
          (e) => {
            e.preventDefault();
            dispatch(toggleHighlight(unique));
          }
        } href=""> Highlight</a>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    unique: ownProps.unique,
    highlighted: state.soqh.questions.indexOf(ownProps.unique) > -1
  };
};

export default connect(mapStateToProps)(SOQHighlightable);
