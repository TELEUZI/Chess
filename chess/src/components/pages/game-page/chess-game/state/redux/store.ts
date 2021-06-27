import { applyMiddleware, createStore, compose, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { changeName, initialPlayerState } from './reducer';

const store = createStore(rootReducer, composeWithDevTools());
store.dispatch(changeName(initialPlayerState));
export default store;
