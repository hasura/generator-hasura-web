import React from 'react';
import {Link} from 'react-router';

const SOQuestion = ({ question }) => {
  return (
    <div>
      <Link to={question.link} dangerouslySetInnerHTML={{__html: question.title}} />
    </div>
  );
};

SOQuestion.propTypes = {
  question: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    link: React.PropTypes.string.isRequired
  }).isRequired
};

export default SOQuestion;
