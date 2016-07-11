import expect from 'expect';
const deepFreeze = require('deep-freeze');

import defaultState from './DataState';
import dataReducer, {setTable, vSetDefaults} from './DataActions';

const testSetTable = () => {
  const stateBefore = {
    ...defaultState
  };
  const action = setTable('users');
  const stateAfter = {
    ...stateBefore,
    currentTable: 'users',
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    dataReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const testVSetDefaults = () => {
  const stateBefore = {
    ...defaultState,
    currentTable: 'interest'
  };
  const action = vSetDefaults();
  const stateAfter = {
    ...stateBefore,
    view : {
      ...stateBefore.view,
      headings: [ "name" ],
      query:{columns: ["*"], limit: 10, offset: 0}
    }
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
      dataReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const testVSetDefaults2 = () => {
  const stateBefore = {
    ...defaultState,
    currentTable: 'user'
  };
  const action = vSetDefaults();
  const stateAfter = {
    ...stateBefore,
    view : {
      ...stateBefore.view,
      headings: [ "age", { type: 'obj_rel', lcol: 'city_id', rcol: 'id', rtable: 'city', _expanded: false, relname: 'city'},
                  "designation", "id", "intent", "name" ],
      query: {columns: ["*"], limit: 10, offset: 0}
    }
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    dataReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

testSetTable();
testVSetDefaults();
testVSetDefaults2();
console.log("Tests passed");
