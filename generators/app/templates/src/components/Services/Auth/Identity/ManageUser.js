import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from './Header';
import {deactivateUser, assignRole, unassignRole, getUser, getRoles,
        activateUser, forceLogout, deleteUser} from './Actions';


class ManageUser extends Component {

  componentWillMount() {
    const {currUser, dispatch} = this.props;
    dispatch(getUser(currUser));
    dispatch(getRoles());
  }

  render() {
    const {loggedInUser, currUser, currUserData, allowedRoles,
           flashMessage, dispatch} = this.props;

    const title = 'Manage User';

    const styles = require('./Styles.scss');

    // display a loading if the data has not been loaded
    if (!currUserData.hasOwnProperty('id') || allowedRoles.length === 0) {
      console.log('returning');
      return (
        <div className="">
          <Header title={title} tabName="detail" flashMessage={flashMessage} />
          <div className="alert alert-warning" role="alert">Loading..</div>
        </div>
      );
    }

    const activateUserWidget = () => {
      if (loggedInUser.hasura_id === currUser) {
        return null;
      }
      if (currUserData.is_active) {
        return (
          <button className="btn btn-sm btn-warning" onClick={(e) => {
            e.preventDefault();
            dispatch(deactivateUser(currUser));
          }}>Deactivate User</button>
        );
      }
      return (
        <button className="btn btn-sm btn-success" onClick={(e) => {
          e.preventDefault();
          dispatch(activateUser(currUser));
        }}>Activate User</button>
      );
    };

    const listSessions = currUserData.active_sessions.map((session, i) => {
      return (
        <div key={i} className="well">
          <div> <b>Session ID</b>: {session.session_id} </div>
          <div> <b>Date</b>: {new Date(session.created).toString()} </div>
        </div>
      );
    });

    const listRolesWidget = currUserData.roles.map((role, i) => {
      return (
        <span className={styles.roleTag + ' label label-info'} key={i}>
          {role} &nbsp;
          <a href="#" className="" onClick={(e) => {
            e.preventDefault();
            dispatch(unassignRole(role, currUser));
          }}>
            <span aria-hidden="true">&times;</span>
          </a>
        </span>
      );
    });

    const addRoleWidget = () => {
      let selected;
      return (
        <form className="form-inline" onSubmit={(e) => {
          e.preventDefault();
          const newRole = selected.value;
          dispatch(assignRole(newRole, currUser));
        }}>
          <select className="input-sm form-control" ref={n => (selected = n)}>
            <option disbaled>--select role--</option>
            {allowedRoles.map((role) => {
              if (role === 'anonymous') {
                return null;
              }
              if (currUserData.roles.indexOf(role) >= 0) {
                return null;
              }
              return (
                <option value={role}>{role}</option>
              );
            })}
          </select> &nbsp;
          <button className="btn btn-sm btn-success">+ Add Role</button>
        </form>
      );
    };

    const forceLogoutWidget = () => {
      if (!currUserData.active_sessions.length) {
        return null;
      }
      return (
        <button className="btn btn-sm btn-warning" onClick={(e) => {
          e.preventDefault();
          dispatch(forceLogout(currUser));
        }}>Force logout
        </button>
      );
    };

    const deleteUserWidget = () => {
      if (loggedInUser.hasura_id === currUser) {
        return null;
      }
      return (
        <div className="col-sm-2">
          <button className="btn btn-danger" onClick={(e) => {
            e.preventDefault();
            if (confirm('Are you sure? This action cannot be undone!')) {
              dispatch(deleteUser(currUser));
            }
          }}>
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i> &nbsp;
            Delete this user!
          </button>
        </div>
      );
    };

    return (
      <div className="">
        <Header title={title} tabName="detail" flashMessage={flashMessage} />
        <div className="col-sm-10 col-sm-offset-1">
          <div className="row">
            <label className="col-sm-2 control-label">Hasura Id</label>
            <div className="col-sm-10">
              {currUserData.id}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              {currUserData.email}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Mobile</label>
            <div className="col-sm-10">
              <p className="form-control-static">{currUserData.mobile}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Username</label>
            <div className="col-sm-10">
              <p className="form-control-static">{currUserData.username}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Is Active</label>
            <div className="col-sm-10">
              <p className="form-control-static">
                {currUserData.is_active.toString()} &nbsp;
                {activateUserWidget()}
              </p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Email Verified</label>
            <div className="col-sm-10">
              <p className="form-control-static">{currUserData.email_verified.toString()}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Mobile Verified</label>
            <div className="col-sm-10">
              <p className="form-control-static">{currUserData.mobile_verified.toString()}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Roles</label>
            <div className="col-sm-10">
              <div className="form-control-static">
                {listRolesWidget}
              </div>
              {addRoleWidget()}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Active Sessions</label>
            <div className="col-sm-10">
              <div className="form-control-static">
                {listSessions}
              </div>
              {forceLogoutWidget()}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Last Login</label>
            <div className="col-sm-10">
              <p className="form-control-static">
                {(currUserData.last_login) ? new Date(currUserData.last_login).toString() : ''}
              </p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2 control-label">Joined</label>
            <div className="col-sm-10">
              <p className="form-control-static">
                {(currUserData.date_joined) ? new Date(currUserData.date_joined).toString() : ''}
              </p>
            </div>
          </div>
          <div className="row"><p></p></div>
          <div className="row">
            {deleteUserWidget()}

          </div>
        </div>
      </div>
    );
  }
}

ManageUser.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
  currUserData: PropTypes.object.isRequired,
  currUser: PropTypes.number.isRequired,
  allowedRoles: PropTypes.array.isRequired,
  flashMessage: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    loggedInUser: state.loginState.credentials,
    currUser: parseInt(ownProps.params.id, 10),
    currUserData: state.auth.view.currUserData,
    allowedRoles: state.auth.view.allowedRoles,
    flashMessage: state.auth.view.flashMessage
  };
};

export default connect(mapStateToProps)(ManageUser);
