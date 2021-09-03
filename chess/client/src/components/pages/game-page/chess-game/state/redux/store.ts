import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducer';

const store = createStore(rootReducer, devToolsEnhancer({ trace: true, traceLimit: 25 }));
export default store;
