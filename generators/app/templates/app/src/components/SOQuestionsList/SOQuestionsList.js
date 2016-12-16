import React from 'react';

import SOQuestion from '../SOQuestion/SOQuestion';
import SOQHighlightable from '../SOQHighlightable/SOQHighlightable';

class SOQuestionsList extends React.Component {
  static propTypes = {
    questions: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      link: React.PropTypes.string.isRequired
    })).isRequired,
    highlightable: React.PropTypes.bool,
    uniquePrefix: React.PropTypes.string
  };

  render() {
    const { questions, highlightable, uniquePrefix } = this.props;

    return (
      <div>
        {
          questions && questions.map((ques, i) => (
            highlightable ?
              <div key={i} style={{ padding: 2 + 'px' }}>
                <SOQHighlightable unique={uniquePrefix.concat(i)} question={ques}/>
              </div>
            :
              <div key={i} style={{ padding: 2 + 'px' }}>
                <SOQuestion question={ques}/>
              </div>
          ))
        }
      </div>
    );
  }
}

export default SOQuestionsList;
