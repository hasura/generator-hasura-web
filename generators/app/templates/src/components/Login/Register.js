import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {Link} from 'react-router';

const Register = () => {
  const styles = require('./Login.scss');
  const loginText = 'Register';
  let password = null; // eslint-disable-line no-unused-vars
  let username = null; // eslint-disable-line no-unused-vars
  return (
    <div className={styles.container + ' container'} id="login">
      <div className={styles.formContainer + ' container'}>
        <div className="col-sm-offset-4 col-md-4">
          <Helmet title="Register | Hasura" />
          <h1> Register <span style={{color: 'grey'}}>@Hasura</span></h1>
          <hr />
          <form className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-12">
                <input type="text" ref={n => {username = n;}} className="form-control" placeholder="email" />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <input type="password" ref={(node) => {password = node;}} className="form-control" placeholder="password" />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <input type="password" ref={(node) => {password = node;}} className="form-control" placeholder="confirm password" />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-6">
                <button type="submit" className="btn btn-success">{loginText}</button>
              </div>
              <div className={styles.loginAlternative + ' col-sm-6 text-right'}>
                <Link to="/login">Login instead</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>);
};

export default connect()(Register);
