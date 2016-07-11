import defaultState from '../State';
import Endpoints, {globalCookiePolicy} from '../../../../Endpoints';
import requestAction from '../requestAction';
import {k8sSecretToAuth, k8sConfigToAuth, authConfigToK8S} from './K8SToAuthMap';

const ROUTE_CHANGED = '@@router/LOCATION_CHANGE';

const UPDATE_CONFIG = 'Config/Update';

const SET_SPARKPOST_KEY = 'Config/SET_SPARKPOST_KEY';
const SET_SENDER_EMAIL = 'Config/SET_EMAIL_SENDER_ADDR';
const SET_SENDER_NAME = 'Config/SET_EMAIL_SENDER_NAME';
const SET_EMAIL_VERIFY_TEMPLATE = 'Config/SET_EMAIL_VERIFY_TEMPLATE';
const SET_EMAIL_FORGOT_PASS_TEMPLATE = 'Config/SET_EMAIL_FORGOT_PASS_TEMPLATE';
const VALIDATE_EMAIL_CONFIG = 'Config/VALIDATE_EMAIL_CONFIG';

const SET_MSG91_KEY = 'Config/SET_MSG91_KEY';
const SET_MSG91_SENDER = 'Config/SET_MSG91_SENDER';
const SET_MOBILE_VERIFY_TEMPLATE = 'Config/SET_MOBILE_VERIFY_TEMPLATE';
const VALIDATE_MOBILE_CONFIG = 'Config/VALIDATE_MOBILE_CONFIG';

const SET_RECAPTCHA_SECRET = 'Config/SET_RECAPTCHA_SECRET';
const VALIDATE_RECAPTCHA_CONFIG = 'Config/VALIDATE_RECAPTCHA_CONFIG';

const SET_LOGIN_USERNAME = 'Config/SET_LOGIN_USERNAME';
const SET_LOGIN_EMAIL = 'Config/SET_LOGIN_EMAIL';
const SET_LOGIN_MOBILE = 'Config/SET_LOGIN_MOBILE';

const SET_G_CLIENTID = 'Config/SET_G_CLIENTID';
const SET_G_CLIENTSECRET = 'Config/SET_G_CLIENTSECRET';
const VALIDATE_G_CONFIG = 'Config/VALIDATE_G_CONFIG';

const SET_FB_APPID = 'Config/SET_FB_APPID';
const SET_FB_APPSECRET = 'Config/SET_FB_APPSECRET';
const VALIDATE_FB_CONFIG = 'Config/VALIDATE_FB_CONFIG';

const SET_LI_CLIENTID = 'Config/SET_LI_CLIENTID';
const SET_LI_CLIENTSECRET = 'Config/SET_LI_CLIENTSECRET';
const VALIDATE_LI_CONFIG = 'Config/VALIDATE_LI_CONFIG';

const SET_OTHER_ACC_DEL = 'Config/SET_OTHER_ACC_DEL';
const SET_OTHER_EMAIL_EXP = 'Config/SET_OTHER_EMAIL_EXP';
const SET_OTHER_PW_EXP = 'Config/SET_OTHER_PW_EXP';
const SET_OTHER_OTP_EXP = 'Config/SET_OTHER_OTP_EXP';
const SET_OTHER_PW_LEN = 'Config/SET_OTHER_PW_LEN';
const SET_OTHER_LOGIN_ATTEMPTS = 'Config/SET_OTHER_LOGIN_ATTEMPTS';
const SET_OTHER_COOLOFFTIME = 'Config/SET_OTHER_COOLOFFTIME';

const CONFIG_GET_SUCCESS = 'Config/CONFIG_GET_SUCCESS';
const CONFIG_GET_ERROR = 'Config/CONFIG_GET_ERROR';

const SECRETS_GET_SUCCESS = 'Config/SECRETS_GET_SUCCESS';
const SECRETS_GET_ERROR = 'Config/SECRETS_GET_ERROR';

const CONFIG_SAVE_SUCCESS = 'Config/CONFIG_SAVE_SUCCESS';
const CONFIG_SAVE_ERROR = 'Config/CONFIG_SAVE_ERROR';

const SECRETS_SAVE_SUCCESS = 'Config/SECRETS_SAVE_SUCCESS';
const SECRETS_SAVE_ERROR = 'Config/SECRETS_SAVE_ERROR';

const CONFIG_SAVE_MAKING_REQUEST = 'Config/CONFIG_SAVE_MAKING_REQUEST';

const authConfigReducer = (state = defaultState, action) => {  // eslint-disable-line no-unused-vars
  switch (action.type) {

    case ROUTE_CHANGED:
      console.log('route changed');
      return {
        ...state,
        view: {
          ...state.view,
          flashMessage: {
            type: '',
            text: ''
          }
        }
      };

    case SET_LOGIN_USERNAME:
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            username: action.data
          }
        }
      };

    case SET_LOGIN_EMAIL:
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            email: action.data
          }
        }
      };

    case SET_LOGIN_MOBILE:
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            mobile: action.data
          }
        }
      };

    case SET_SPARKPOST_KEY:
      return {
        ...state,
        config: {
          ...state.config,
          email: {
            ...state.config.email,
            sparkpost_api_key: action.data
          }
        }
      };

    case SET_SENDER_EMAIL:
      return {
        ...state,
        config: {
          ...state.config,
          email: {
            ...state.config.email,
            sender_email: action.data
          }
        }
      };

    case SET_SENDER_NAME:
      return {
        ...state,
        config: {
          ...state.config,
          email: {
            ...state.config.email,
            sender_name: action.data
          }
        }
      };

    case SET_EMAIL_VERIFY_TEMPLATE:
      return {
        ...state,
        config: {
          ...state.config,
          email: {
            ...state.config.email,
            templates: {
              ...state.config.email.templates,
              verify_email: action.data
            }
          }
        }
      };

    case SET_EMAIL_FORGOT_PASS_TEMPLATE:
      return {
        ...state,
        config: {
          ...state.config,
          email: {
            ...state.config.email,
            templates: {
              ...state.config.email.templates,
              forgot_password: action.data
            }
          }
        }
      };

    case VALIDATE_EMAIL_CONFIG:
      const email = state.config.email;
      let emailVerif = false;

      if (email.sparkpost_api_key && email.sender_email && email.sender_name &&
          email.templates.verify_email && email.templates.forgot_password) {
        emailVerif = true;
      }

      return {
        ...state,
        config: {
          ...state.config,
          verification_for: {
            ...state.config.verification_for,
            email: emailVerif
          }
        }
      };

    case SET_MSG91_KEY:
      return {
        ...state,
        config: {
          ...state.config,
          mobile: {
            ...state.config.mobile,
            msg91_key: action.data
          }
        }
      };

    case SET_MSG91_SENDER:
      return {
        ...state,
        config: {
          ...state.config,
          mobile: {
            ...state.config.mobile,
            msg91_sender: action.data
          }
        }
      };

    case SET_MOBILE_VERIFY_TEMPLATE:
      return {
        ...state,
        config: {
          ...state.config,
          mobile: {
            ...state.config.mobile,
            templates: {
              ...state.config.mobile.templates,
              verify_mobile: action.data
            }
          }
        }
      };

    case VALIDATE_MOBILE_CONFIG:
      const mobile = state.config.mobile;
      let mobileVerif = false;
      if (mobile.msg91_key && mobile.msg91_sender && mobile.templates.verify_mobile) {
        mobileVerif = true;
      }
      return {
        ...state,
        config: {
          ...state.config,
          verification_for: {
            ...state.config.verification_for,
            mobile: mobileVerif
          }
        }
      };

    case SET_RECAPTCHA_SECRET:
      return {
        ...state,
        config: {
          ...state.config,
          recaptcha: {
            ...state.config.recaptcha,
            secret: action.data
          }
        }
      };

    case VALIDATE_RECAPTCHA_CONFIG:
      const recaptcha = state.config.recaptcha;
      let recapVerif = false;
      if (recaptcha.secret) {
        recapVerif = true;
      }
      return {
        ...state,
        config: {
          ...state.config,
          verification_for: {
            ...state.config.verification_for,
            recaptcha: recapVerif
          }
        }
      };

    case SET_G_CLIENTID:
      return {
        ...state,
        config: {
          ...state.config,
          google: {
            ...state.config.google,
            client_id: action.data
          }
        }
      };

    case SET_G_CLIENTSECRET:
      return {
        ...state,
        config: {
          ...state.config,
          google: {
            ...state.config.google,
            client_secret: action.data
          }
        }
      };

    case VALIDATE_G_CONFIG:
      const google = state.config.google;
      let googleVerif = false;
      if (google.client_id && google.client_secret) {
        googleVerif = true;
      }
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            google: googleVerif
          }
        }
      };

    case SET_FB_APPID:
      return {
        ...state,
        config: {
          ...state.config,
          facebook: {
            ...state.config.facebook,
            app_id: action.data
          }
        }
      };

    case SET_FB_APPSECRET:
      return {
        ...state,
        config: {
          ...state.config,
          facebook: {
            ...state.config.facebook,
            app_secret: action.data
          }
        }
      };

    case VALIDATE_FB_CONFIG:
      const facebook = state.config.facebook;
      let fbVerif = false;
      if (facebook.app_id && facebook.app_secret) {
        fbVerif = true;
      }
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            facebook: fbVerif
          }
        }
      };

    case SET_LI_CLIENTID:
      return {
        ...state,
        config: {
          ...state.config,
          linkedin: {
            ...state.config.linkedin,
            client_id: action.data
          }
        }
      };

    case SET_LI_CLIENTSECRET:
      return {
        ...state,
        config: {
          ...state.config,
          linkedin: {
            ...state.config.linkedin,
            client_secret: action.data
          }
        }
      };

    case VALIDATE_LI_CONFIG:
      const linkedin = state.config.linkedin;
      let liVerif = false;
      if (linkedin.client_id && linkedin.client_secret) {
        liVerif = true;
      }
      return {
        ...state,
        config: {
          ...state.config,
          login_using: {
            ...state.config.login_using,
            linkedin: liVerif
          }
        }
      };

    case SET_OTHER_ACC_DEL:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            allow_user_account_delete: action.data
          }
        }
      };

    case SET_OTHER_EMAIL_EXP:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            email_verification_expires_days: action.data
          }
        }
      };

    case SET_OTHER_PW_EXP:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            password_reset_expires_days: action.data
          }
        }
      };

    case SET_OTHER_OTP_EXP:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            sms_verification_expires_mins: action.data
          }
        }
      };

    case SET_OTHER_PW_LEN:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            password_min_length: action.data
          }
        }
      };

    case SET_OTHER_LOGIN_ATTEMPTS:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            login_failure_limit: action.data
          }
        }
      };

    case SET_OTHER_COOLOFFTIME:
      return {
        ...state,
        config: {
          ...state.config,
          other: {
            ...state.config.other,
            lockout_cooloff_time: action.data
          }
        }
      };

    case CONFIG_GET_SUCCESS:
      return {
        ...state,
        config: k8sConfigToAuth(action.data.data)
      };

    case SECRETS_GET_SUCCESS:
      const secrets = k8sSecretToAuth(action.data.data);
      const newConfig = {
        email: {...state.config.email, ...secrets.email},
        mobile: {...state.config.mobile, ...secrets.mobile},
        recaptcha: secrets.recaptcha,
        google: {...state.config.google, ...secrets.google},
        facebook: {...state.config.facebook, ...secrets.facebook},
        linkedin: {...state.config.linkedin, ...secrets.linkedin},
        other: state.config.other,
        login_using: state.config.login_using,
        verification_for: state.config.verification_for
      };
      return {
        ...state,
        config: newConfig
      };

    case CONFIG_GET_ERROR:
      return {...state};

    case CONFIG_SAVE_SUCCESS:
      return {...state};

    case CONFIG_SAVE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          ongoingRequest: false,
          flashMessage: {
            type: 'error',
            text: 'Unable to save config data. Please try again.'
          }
        }
      };

    case CONFIG_SAVE_MAKING_REQUEST:
      return {
        ...state,
        view: {
          ...state.view,
          ongoingRequest: true
        }
      };

    case SECRETS_SAVE_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          ongoingRequest: false,
          flashMessage: {
            type: 'success',
            text: 'Saved!'
          }
        }
      };

    case SECRETS_SAVE_ERROR:
      return {
        ...state,
        view: {
          ...state.view,
          ongoingRequest: false,
          flashMessage: {
            type: 'error',
            text: 'Unable to save config data. Please try again.'
          }
        }
      };

    default:
      return state;
  }
  return state;
};


const getConfig = () => {
  return (dispatch) => {
    let url = Endpoints.admin.configMap;
    const options = {
      method: 'GET',
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, CONFIG_GET_SUCCESS, CONFIG_GET_ERROR))
      .then(() => {
        url = Endpoints.admin.secrets;
        dispatch(requestAction(url, options, SECRETS_GET_SUCCESS, SECRETS_GET_ERROR));
      });
  };
};

const saveConfig = () => {
  return (dispatch, getState) => {
    dispatch({type: CONFIG_SAVE_MAKING_REQUEST});
    let url = Endpoints.admin.configMap;
    const config = getState().auth.config;
    const {configMap, secrets} = authConfigToK8S(config);
    const options = {
      method: 'PATCH',
      body: JSON.stringify({data: configMap}),
      headers: {'Content-Type': 'application/strategic-merge-patch+json'},
      credentials: globalCookiePolicy
    };
    return dispatch(requestAction(url, options, CONFIG_SAVE_SUCCESS, CONFIG_SAVE_ERROR))
      .then(() => {
        url = Endpoints.admin.secrets;
        options.body = JSON.stringify({data: secrets});
        dispatch(requestAction(url, options, SECRETS_SAVE_SUCCESS, SECRETS_SAVE_ERROR));
      });
  };
};

export default authConfigReducer;
export {getConfig, saveConfig, UPDATE_CONFIG, SET_SPARKPOST_KEY,
  SET_SENDER_EMAIL, SET_SENDER_NAME, SET_EMAIL_VERIFY_TEMPLATE,
  SET_EMAIL_FORGOT_PASS_TEMPLATE, VALIDATE_EMAIL_CONFIG, SET_MSG91_KEY,
  SET_MSG91_SENDER, SET_MOBILE_VERIFY_TEMPLATE, VALIDATE_MOBILE_CONFIG,
  SET_RECAPTCHA_SECRET, VALIDATE_RECAPTCHA_CONFIG, SET_LOGIN_USERNAME,
  SET_LOGIN_EMAIL, SET_LOGIN_MOBILE, SET_G_CLIENTID, SET_G_CLIENTSECRET,
  SET_FB_APPID, SET_FB_APPSECRET, SET_LI_CLIENTID, SET_LI_CLIENTSECRET,
  VALIDATE_G_CONFIG, VALIDATE_FB_CONFIG, VALIDATE_LI_CONFIG, SET_OTHER_ACC_DEL,
  SET_OTHER_EMAIL_EXP, SET_OTHER_PW_EXP, SET_OTHER_OTP_EXP, SET_OTHER_PW_LEN,
  SET_OTHER_LOGIN_ATTEMPTS, SET_OTHER_COOLOFFTIME};
