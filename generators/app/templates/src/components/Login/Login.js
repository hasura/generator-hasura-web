import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {makeRequest} from './Actions';

const Login = ({dispatch, ongoingRequest, lastError, lastSuccess}) => {
  const styles = require('./Login.scss');
  let loginText = 'Login';
  let username;
  let password;
  if (ongoingRequest) {
    loginText = 'Logging in...';
  } else if (lastSuccess) {
    loginText = 'Done!';
  } else if (lastError) {
    loginText = 'Error. Try again?';
  }

  return (
    <div className={styles.container + ' container'} id="login">
      <div className={styles.formContainer + ' container'}>
        <div className="col-sm-offset-4 col-md-4">
          <Helmet title="Login | Hasura" />
          <h1> Login <span style={{color: 'grey'}}>@Hasura</span></h1>
          <hr />
          <form className="form-horizontal" onSubmit={e => {
            e.preventDefault();
            dispatch(makeRequest({username: username.value, password: password.value}));
          }}>
            <div className="form-group">
              <div className="col-sm-12">
                <input type="text" ref={(node) => {username = node;}} className="form-control" placeholder="username" />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <input type="password" ref={(node) => {password = node;}} className="form-control" placeholder="password" />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-6">
                <button type="submit" className="btn btn-success">{loginText}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>);
};

const mapStateToProps = (state) => {
  return {...state.loginState};
};

export default connect(mapStateToProps)(Login);
