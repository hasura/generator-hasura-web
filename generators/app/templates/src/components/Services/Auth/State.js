import defaultConfig from './Config/State';
import defaultView from './Identity/State';

const defaultState = {
  config: defaultConfig,
  view: defaultView,
  columns: [
    'hasura_id',
    'email',
    'mobile',
    'username',
    'is_active',
    'email_verified',
    'mobile_verified',
    'is_admin',
    'last_login',
    'date_joined'
  ]
};
export default defaultState;
