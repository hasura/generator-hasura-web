import expect from 'expect';
import loginReducer, { makeRequest, requestFailed, requestSuccess } from './Actions';
const deepFreeze = require('deep-freeze');

const testRequestFailed = () => {
  const stateBefore = {
    ongoingRequest: true,
    lastError: null,
    lastSuccess: null
  };
  const action = requestFailed('failed-test');
  const stateAfter = {
      ongoingRequest: false,
      lastError: 'failed-test',
      lastSuccess: null
    };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
      loginReducer(stateBefore, action)
      ).toEqual(stateAfter);
};

const testRequestSuccess = () => {
  const stateBefore = {
    ongoingRequest: true,
    lastError: null,
    lastSuccess: null
  };
  const action = requestSuccess('req-success');
  const stateAfter = {
      ongoingRequest: false,
      lastError: null,
      lastSuccess: 'req-success'
    };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
      loginReducer(stateBefore, action)
      ).toEqual(stateAfter);
};


testRequestFailed();
testRequestSuccess();
console.log("Tests passed");
