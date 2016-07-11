import React from 'react';

// import _push from './push';
import {deleteRole, addRole} from './Actions';

const RolesViewRoles = ({columns, rows = [], dispatch}) => {  // padded-blocks

  const styles = require('./Styles.scss');

  // Get the headings
  const tableHeadings = [];
  columns.map((column, i) => {
    tableHeadings.push(<th key={i}>{column}</th>);
  });

  tableHeadings.push(<th key="relIndicator" style={{minWidth: 'auto', color: '#aaa', fontWeight: 300}}> &lt;&gt; </th>);

  // Get the rows
  const tableRows = rows.map((row, i) => {
    if (['admin', 'user', 'anonymous'].indexOf(row) >= 0) {
      return (
        <tr key={i}>
          <td>{row}</td>
        </tr>
      );
    }
    return (
      <tr key={i}>
        <td>{row}</td>
        <td onClick={(e) => {
          e.preventDefault();
          dispatch(deleteRole(row));
        }}>
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </td>
      </tr>
    );
  });

  const addRoleWidget = (() => {
    let newRole;
    return (
      <div className="container-fluid">
        <form className="form-inline" onSubmit={(e) => {
          e.preventDefault();
        }}>
          <div className="form-group">
            <label>Add Role </label> &nbsp;
            <input ref={(n) => newRole = n} type="text" className="form-control" placeholder="New Role Name"/>
          </div> &nbsp;
          <button type="submit" className="btn btn-success" onClick={(e) => {
            e.preventDefault();
            dispatch(addRole(newRole.value));
            newRole.value = '';
          }}> + Add</button>
        </form>
      </div>
    );
  })();

  return (
    <div className={'container-fluid ' + styles.viewRowsContainer}>
      {addRoleWidget}
      <div className={styles.tableContainer}>
        <table className={styles.table + ' table table-bordered table-striped table-hover'}>
          <thead>
            <tr>
              {tableHeadings}
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 ? null : tableRows}
          </tbody>
        </table>
      </div>
      <br/><br/>
    </div>
  );
};

export default RolesViewRoles;
