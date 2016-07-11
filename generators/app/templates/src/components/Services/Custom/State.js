const defaultState = {
  service: {
    name: '',
    env: [{
      name: '',
      value: ''
    }],
    files: [{
      path: '',
      content: ''
    }]
  },
  ongoingRequest: false,
  lastSuccess: null,
  lastError: null
};

export default defaultState;
