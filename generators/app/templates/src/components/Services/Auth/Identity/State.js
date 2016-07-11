const defaultView = {
  limit: 10,
  currOffset: 0,
  rows: [],
  totalRows: 0,
  currUser: null,
  currUserData: {},
  allowedRoles: [],
  newUser: {
    email: null,
    mobile: null,
    username: null,
    password: null,
    roles: []
  },
  ongoingRequest: false,
  lastError: {},
  lastSuccess: {},
  flashMessage: {
    type: '',
    text: ''
  }
};

export default defaultView;
