import {createStore, applyMiddleware} from 'redux';
import {reducer} from './reducer';
import thunkMiddlware from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunkMiddlware));

export * from './action';
export {store};
