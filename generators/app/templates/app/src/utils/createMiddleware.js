export default function createMiddleware(client) {
  // Function that takes current state and dispatch function
  return ({dispatch, getState}) => {
    // Returns a function that takes the next to perform function
    return next =>
      // Returns a function that takes the action to be performed
      action => {
        // If action is a function
        if (typeof action === 'function') {
          // Dispatch that action with the known state
          return action(dispatch, getState);
        }

        // Get the type, promise and other parameters of the action
        const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

        // If the action does not involve a promise
        if (!promise) {
          // Return the nextState and action on it
          return next(action);
        }

        // Remember the types of actions that can happen
        const [REQUEST, SUCCESS, FAILURE] = types;
        // Perform the nextAction with the parameters and the load/request action
        next({...rest, type: REQUEST});

        // The involved promise is passed to the API client
        const actionPromise = promise(client);

        // Return from the promise
        actionPromise.then(
          (result) => next({...rest, result, type: SUCCESS}),
          (error) => next({...rest, error, type: FAILURE})
        ).catch((error)=> {
          console.error('MIDDLEWARE ERROR:', error);
          next({...rest, error, type: FAILURE});
        });

        // Return whatever was the result of the promise
        return actionPromise;
      };
  };
}
