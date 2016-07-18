import React from 'react';
import { connect } from 'react-redux';
import { onNameSubmit } from './Actions';

const EnterName = ({ dispatch }) => {
  let inputName;
  return (
    <div>
      <h3>What is your name?</h3>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          dispatch(
            onNameSubmit(inputName.value)
          );
        }
      }>
        <input type="text" name="gname" ref={ (ref) => (inputName = ref) }/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default connect()(EnterName);
