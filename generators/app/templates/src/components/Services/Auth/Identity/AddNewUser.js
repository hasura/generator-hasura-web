import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {getRoles, addUser, NEWUSER_UPDATE} from './Actions';


class AddNewUser extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getRoles());
  }

  componentWillUnmount() {
  }

  render() {
    const {dispatch, newUser, allowedRoles, flashMessage} = this.props;

    const title = 'Add User';
    const styles = require('./Styles.scss');

    console.log('rendering');
    console.log('roles', newUser.roles);
    const addedRoles = newUser.roles.map((role, i) => {
      return (
        <span className={styles.roleTag + ' label label-info'} key={i}>
          {role} &nbsp;
          <a href="#" className="" onClick={(e) => {
            e.preventDefault();
            // dispatch(unassignRole(role, currUser));
          }}>
            <span aria-hidden="true">&times;</span>
          </a>
        </span>
      );
    });

    let username;
    let email;
    let password;
    let mobile;
    let isActive;
    let selected;
    return (
      <div className="">
        <Header title={title} tabName="insert" flashMessage={flashMessage}/>
        <div className="col-sm-10">
          <form className="form-horizontal" onSubmit={(e) => {
            e.preventDefault();
            const data = {username: username.value, email: email.value, mobile: mobile.value,
              password: password.value, is_active: isActive.checked};
            console.log(data);
            dispatch(addUser(data));
          }}>
            <div className="form-group">
              <label htmlFor="email" className="col-sm-2 control-label">Email</label>
              <div className="col-sm-10">
                <input type="email" className="form-control" name="email" placeholder="email"
                ref={(n) => email = n}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username" className="col-sm-2 control-label">Username</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="username" placeholder="username"
                ref={(n) => username = n}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="mobile" className="col-sm-2 control-label">Mobile</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="mobile" placeholder="mobile"
                ref={(n) => mobile = n}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="col-sm-2 control-label">Password</label>
              <div className="col-sm-10">
                <input type="password" className="form-control" name="password" placeholder="password"
                ref={(n) => password = n}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="roles" className="col-sm-2 control-label">Roles</label>
              <div className="col-sm-10">
                <div className="row">
                  <div className="col-sm-12">
                    {addedRoles}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    <select name="roles" className="form-control" ref={(n) => selected = n}>
                      <option defaultValue>-- select role --</option>
                      {allowedRoles.map((role, i) => {
                        if (role === 'anonymous') {
                          return null;
                        }
                        if (newUser.roles.indexOf(role) >= 0) {
                          return null;
                        }
                        return (
                          <option key={i} value={role}>{role}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <button className="btn btn-sm btn-success" onClick={(e) => {
                      e.preventDefault();
                      newUser.roles.push(selected.value);
                      dispatch({type: NEWUSER_UPDATE, data: newUser});
                    }}>
                      + Add Role
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <div className="checkbox">
                  <label>
                    <input type="checkbox" name="is_active" ref={(n) => isActive = n}/> Activate User
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-success">+ Add User</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddNewUser.propTypes = {
  newUser: PropTypes.object.isRequired,
  allowedRoles: PropTypes.array.isRequired,
  flashMessage: PropTypes.object.isRequired,
  lastSuccess: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    newUser: state.auth.view.newUser,
    allowedRoles: state.auth.view.allowedRoles,
    flashMessage: state.auth.view.flashMessage,
    lastSuccess: state.auth.view.lastSuccess
  };
};

export default connect(mapStateToProps)(AddNewUser);
