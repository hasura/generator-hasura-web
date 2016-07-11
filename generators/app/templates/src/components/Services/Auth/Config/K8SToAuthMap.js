/* Helper functions to convert from our internal config state to
 * Hauthy's config object */

const authConfigToK8S = (config) => {
  const configMap = {
    'account.allow.user.delete': (config.other.allow_user_account_delete) ? 'true' : '',
    'account.email.verification.expires': config.other.email_verification_expires_days,
    'account.password.reset.expires': config.other.password_reset_expires_days,
    'account.otp.expires': config.other.sms_verification_expires_mins,
    'account.password.min.length': config.other.password_min_length,
    'account.login.failure.limit': config.other.login_failure_limit,
    'account.login.cooloff.time': config.other.lockout_cooloff_time,
    'email.sender.id': config.email.sender_email,
    'email.sender.name': config.email.sender_name,
    'email.templates.verify': config.email.templates.verify_email,
    'email.templates.forgot': config.email.templates.forgot_password,
    'mobile.msg91.sender': config.mobile.msg91_sender,
    'mobile.templates.otp': config.mobile.templates.verify_mobile,
    'google.id': config.google.client_id,
    'facebook.id': config.facebook.app_id,
    'linkedin.id': config.linkedin.client_id,
    'email.verification': (config.verification_for.email) ? 'true' : '',
    'mobile.verification': (config.verification_for.mobile) ? 'true' : '',
    'recaptcha.verification': (config.verification_for.recaptcha) ? 'true' : ''
  };
  const logins = [];
  for (const key of Object.keys(config.login_using)) {
    if (config.login_using[key] === true) {
      logins.push(key);
    }
  }
  configMap['account.logins'] = JSON.stringify(logins);
  const secrets = {
    'email.key': btoa(config.email.sparkpost_api_key),
    'mobile.msg91.key': btoa(config.mobile.msg91_key),
    'recaptcha.secret': btoa(config.recaptcha.secret),
    'google.secret': btoa(config.google.client_secret),
    'facebook.secret': btoa(config.facebook.app_secret),
    'linkedin.secret': btoa(config.linkedin.client_secret)
  };
  return {
    configMap: configMap,
    secrets: secrets
  };
};

const k8sConfigToAuth = (config) => {
  const other = {};
  other.allow_user_account_delete = config['account.allow.user.delete'];
  other.email_verification_expires_days = config['account.email.verification.expires'];
  other.password_reset_expires_days = config['account.password.reset.expires'];
  other.sms_verification_expires_mins = config['account.otp.expires'];
  other.password_min_length = config['account.password.min.length'];
  other.login_failure_limit = config['account.login.failure.limit'];
  other.lockout_cooloff_time = config['account.login.cooloff.time'];
  const email = {templates: {}};
  email.sender_email = config['email.sender.id'];
  email.sender_name = config['email.sender.name'];
  email.templates.verify_email = config['email.templates.verify'];
  email.templates.forgot_password = config['email.templates.forgot'];
  const mobile = {templates: {}};
  mobile.msg91_sender = config['mobile.msg91.sender'];
  mobile.templates.verify_mobile = config['mobile.templates.otp'];
  const google = {};
  google.client_id = config['google.id'];
  const fb = {};
  fb.app_id = config['facebook.id'];
  const li = {};
  li.client_id = config['linkedin.id'];
  const verifFor = {};
  verifFor.email = (config['email.verification']) ? true : false;
  verifFor.mobile = (config['mobile.verification']) ? true : false;
  verifFor.recaptcha = (config['recaptcha.verification']) ? true : false;
  const loginUsing = {};
  loginUsing.username = (config['account.logins'].indexOf('username') >= 0) ? true : false;
  loginUsing.email = (config['account.logins'].indexOf('email') >= 0) ? true : false;
  loginUsing.mobile = (config['account.logins'].indexOf('mobile') >= 0) ? true : false;

  return {
    login_using: loginUsing,
    verification_for: verifFor,
    email: email,
    mobile: mobile,
    google: google,
    facebook: fb,
    linkedin: li,
    other: other
  };
};

const k8sSecretToAuth = (config) => {
  const email = {
    sparkpost_api_key: atob(config['email.key'])
  };
  const mobile = {
    msg91_key: atob(config['mobile.msg91.key'])
  };
  const google = {
    client_secret: atob(config['google.secret'])
  };
  const fb = {
    app_secret: atob(config['facebook.secret'])
  };
  const li = {
    client_secret: atob(config['linkedin.secret'])
  };
  const recap = {
    secret: atob(config['recaptcha.secret'])
  };

  return {
    email: email,
    mobile: mobile,
    google: google,
    facebook: fb,
    linkedin: li,
    recaptcha: recap
  };
};

export {k8sConfigToAuth, k8sSecretToAuth, authConfigToK8S};
