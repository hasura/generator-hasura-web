import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {getRoles} from './Actions'; // eslint-disable-line no-unused-vars
import RolesViewRows from './RolesViewRows';
import Header from './Header';


class ManageRole extends Component {
  componentWillMount() {
    // Initialize this table
    const dispatch = this.props.dispatch;
    dispatch(getRoles());
  }

  componentWillUpdate() {
    this.shouldScrollBottom = (window.innerHeight === document.body.offsetHeight - document.body.scrollTop);
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      document.body.scrollTop = document.body.offsetHeight - window.innerHeight;
    }
  }

  render() {
    const {allowedRoles, view, dispatch} = this.props;  // eslint-disable-line no-unused-vars

    const styles = require('./Styles.scss');

    const title = 'Roles';
    const columns = ['name'];

    // Are there any expanded columns
    const viewRows = (<RolesViewRows columns={columns}
                                     rows={allowedRoles}
                                     dispatch={dispatch}/>);

    return (
      <div className={styles.container + ' container-fluid'}>
        <Header title={title} tabName="roles" flashMessage={view.flashMessage} />
        <div className="container-fluid">
          {viewRows}
        </div>
      </div>
    );
  }
}

ManageRole.propTypes = {
  view: PropTypes.object.isRequired,
  allowedRoles: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    view: state.auth.view,
    allowedRoles: state.auth.view.allowedRoles
  };
};

export default connect(mapStateToProps)(ManageRole);
