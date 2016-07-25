import React from 'react';

import SOQuestion from '../SOQuestion/SOQuestion';

class SOQuestionsList extends React.Component {
  static propTypes = {
    questions: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      link: React.PropTypes.string.isRequired
    })).isRequired
  };

  render() {
    const { questions } = this.props;

    return (
      <div>
        {
          questions.map((ques, i) => (
            <SOQuestion key={i} question={ques}/>
          ))
        }
      </div>
    );
  }
}

export default SOQuestionsList;
