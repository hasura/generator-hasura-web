const defaultEnv = [{
  name: '',
  value: ''
}];
const defaultState = {
  deployment: null,
  newEnv: [...defaultEnv],
  ongoingRequest: false,
  lastSuccess: null,
  lastError: null
};

export {defaultEnv};
export default defaultState;
