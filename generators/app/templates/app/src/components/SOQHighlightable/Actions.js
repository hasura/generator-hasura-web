import defaultState from './State';

const HIGHLIGHT = 'SOQHighlightable/toggleHighlight';

const toggleHighlight = (i) => ({
  type: HIGHLIGHT,
  questionKey: i
});

const soqhReducer = (state = defaultState, action) => {
  switch (action.type) {

    case HIGHLIGHT:
      const newQuestions = state.questions;

      const index = newQuestions.indexOf(action.questionKey);
      if (index < 0) {
        newQuestions.push(action.questionKey);
      } else {
        newQuestions.splice(index, 1);
      }

      return {
        ...state,
        questions: newQuestions
      };

    default:
      return {...state};
  }
};

export default soqhReducer;
export { toggleHighlight };
