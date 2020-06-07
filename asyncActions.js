const redux = require('redux');
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const thunkMiddleware = require('redux-thunk').default;
const axios = require('axios');

// define the initial states
const initalState = {
  loading: false,
  users: [],
  error: ''
};

// define the action constants strings
const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// define the functions actions type
const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST
});

const fetchUserSuccess = users => ({
  type: FETCH_USER_SUCCESS,
  payload: users
});

const fetchUserFailure = () => ({
  type: FETCH_USER_FAILURE,
  payload: error
});

// define the reducer to to have a single point for all actions types
const reducers = (state = initalState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_USER_SUCCESS:
      return {
        loading: false,
        users: action.payload
      };
    case FETCH_USER_FAILURE:
      return {
        users: [],
        error: action.payload
      };

    default:
      break;
  }
};

// define fetch users function to make a async call
const fetchUsers = () => {
  return dispatch => {
    dispatch(fetchUserRequest());
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        const users = response.data.map(user => user.id);
        dispatch(fetchUserSuccess(users));
      })
      .catch(error => {
        dispatch(fetchUserFailure(error.message));
      });
  };
};

// define the store to include all reducers and apply the thunk Middle
const store = createStore(reducers, applyMiddleware(thunkMiddleware));
store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
