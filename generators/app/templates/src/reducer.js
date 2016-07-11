import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import loginReducer from './components/Login/Actions';
import dataReducer from './components/Services/Data/DataActions';
import addTableReducer from './components/Services/Data/Add/AddActions';
import addExistingTableReducer from './components/Services/Data/Add/AddExistingTableActions';
import addExistingViewReducer from './components/Services/Data/Add/AddExistingViewActions';
import customAddReducer from './components/Services/Custom/Actions';
import authReducer from './components/Services/Auth/Actions';
import mainReducer from './components/Main/Actions';
import headerReducer from './components/Main/HeaderActions';
import homeReducer from './components/Home/Actions';
import csmReducer from './components/Services/CustomService/CSMActions';
import cscReducer from './components/Services/CustomService/CSCActions';
import dmReducer from './components/Services/Data/Manage/Actions';
import amReducer from './components/Services/Auth/Manage/Actions';
import advancedSettingsReducer from './components/Advanced/Actions';

const reducer = combineReducers({
  loginState: loginReducer,
  tables: dataReducer,
  addTable: combineReducers({
    table: addTableReducer,
    existingTable: addExistingTableReducer,
    existingView: addExistingViewReducer
  }),
  dataManage: dmReducer,
  authManage: amReducer,
  main: mainReducer,
  header: headerReducer,
  customAdd: customAddReducer,
  custom: combineReducers({
    manage: csmReducer,
    configure: cscReducer
  }),
  home: homeReducer,
  auth: authReducer,
  routing: routerReducer,
  advanced: advancedSettingsReducer
});

export default reducer;
