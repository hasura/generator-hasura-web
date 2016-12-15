import defaultState from './State';

const HIGHLIGHT = 'SOQHighlightable/toggleHighlight';

const toggleHighlight = (i) => ({
  type: HIGHLIGHT,
  questionKey: i
});

const soqhReducer = (state = defaultState, action) => {
  const questions = state.questions;
  const index = state.questions.indexOf(action.questionKey);

  switch (action.type) {
    case HIGHLIGHT:
      return { ...state,
        questions: index > 0 ? questions.slice(0, index).concat(questions.slice(index + 1)) :
          questions.concat(action.questionKey)
      };
    default:
      return { ...state};
  }
};

export default soqhReducer;
export { toggleHighlight };
