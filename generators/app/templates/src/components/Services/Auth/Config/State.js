const defaultConfig = {
  ongoingRequest: false,
  flashMessage: {
    type: '',
    text: ''
  },
  account: {},
  login_using: {
    username: true,
    email: false,
    mobile: false,
    google: false,
    facebook: false,
    linkedin: false
  },
  verification_for: {
    email: false,
    mobile: false,
    recaptcha: false
  },
  email: {
    'sparkpost_api_key': '',
    'sender_email': '',
    'sender_name': '',
    templates: {
      'verify_email': '<p>Hi! Please click on http://myawesomeapp.com/verify-email?token=%(token)s to verify your email.</p>',
      'forgot_password': '<p>Hi! Please click on http://myawesomeapp.com/reset-password?token=%(token)s to reset your password.</p>'
    }
  },
  mobile: {
    'msg91_key': '',
    'msg91_sender': '',
    templates: {
      'verify_mobile': 'Hi %(name)s. Verify your phone for your MyAwesomeApp account. Your OTP is %(otp)s.'
    }
  },
  google: {
    'client_id': '',
    'client_secret': ''
  },
  facebook: {
    'app_id': '',
    'app_secret': ''
  },
  linkedin: {
    'client_id': '',
    'client_secret': ''
  },
  recaptcha: {
    'secret': ''
  },
  other: {
    'allow_user_account_delete': false,
    'email_verification_expires_days': 5,
    'password_reset_expires_days': 2,
    'sms_verification_expires_mins': 15,
    'password_min_length': 8,
    'login_failure_limit': 5,
    'lockout_cooloff_time': 600
  }
};

export default defaultConfig;
