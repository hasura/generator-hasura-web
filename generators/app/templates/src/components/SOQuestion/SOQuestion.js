import React from 'react';
import {Link} from 'react-router';

class SOQuestion extends React.Component {
  static propTypes = {
    question: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      link: React.PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { question } = this.props;

    return (
      <div>
        <Link to={question.link} dangerouslySetInnerHTML={{__html: question.title}} />
      </div>
    );
  }
}

export default SOQuestion;
