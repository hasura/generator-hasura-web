import React from 'react';

import SOQuestion from '../SOQuestion/SOQuestion';

const SOQuestionsList = ({ questions }) => {
  return (
    <div>
      {
        questions.map((ques, i) => (
          <SOQuestion key={i} question={ques}/>
        ))
      }
    </div>
  );
};

SOQuestionsList.propTypes = {
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    link: React.PropTypes.string.isRequired
  })).isRequired
};

export default SOQuestionsList;
