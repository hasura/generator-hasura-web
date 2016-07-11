import React from 'react';

import {getUsers, CURRENT_OFFSET} from './Actions';
import _push from '../push';

const ViewRows = ({columns, rows = [], totalRows, currOffset, limit,
                  dispatch}) => {  // padded-blocks

  const styles = require('./Styles.scss');

  // Get the headings
  const tableHeadings = [];
  columns.map((column, i) => {
    tableHeadings.push(<th key={i}>{column}</th>);
  });

  tableHeadings.push(<th key="relIndicator" style={{minWidth: 'auto', color: '#aaa', fontWeight: 300}}> &lt;&gt; </th>);

  // Get the rows
  const tableRows = rows.map((row) => {
    return (
      <tr key={row.id} onClick={(e) => {
        e.preventDefault();
        dispatch(_push('/manage/users/' + row.id));
      }}>
        <td>{row.id}</td>
        <td>{row.email}</td>
        <td>{row.mobile}</td>
        <td>{row.username}</td>
        <td>{row.is_active.toString()}</td>
        <td>{row.email_verified.toString()}</td>
        <td>{row.mobile_verified.toString()}</td>
        <td>{row.is_superuser.toString()}</td>
        <td>{(row.last_login === null) ? null : new Date(row.last_login).toString()}</td>
        <td>{new Date(row.date_joined).toString()}</td>
      </tr>
    );
  });

  // sub-component and logic for pagination
  const tablePagination = (() => {
    return (
      <nav>
        <ul className="pager">
          <li className={'previous ' + ((currOffset === 0) ? 'disabled' : '')}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              if (currOffset <= 0) {
                return;
              }
              const newOffset = currOffset - limit;
              dispatch({type: CURRENT_OFFSET, data: {currOffset: newOffset}});
              dispatch(getUsers());
            }}>
              <span aria-hidden="true">&larr;</span> Previous
            </a>
          </li>
          <li className={'next ' + ((currOffset + limit >= totalRows) ? 'disabled' : '')}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              if (currOffset + limit >= totalRows) {
                return;
              }
              const newOffset = currOffset + limit;
              if (newOffset > totalRows) {
                return;
              }
              dispatch({type: CURRENT_OFFSET, data: {currOffset: newOffset}});
              dispatch(getUsers());
            }}>
              Next <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  })();

  return (
    <div className={'container-fluid ' + styles.viewRowsContainer}>
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
      {tablePagination}
      <br/><br/>
    </div>
  );
};

export default ViewRows;
