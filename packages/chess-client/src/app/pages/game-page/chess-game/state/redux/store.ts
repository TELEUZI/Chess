import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: { trace: true, traceLimit: 25 },
});
export default store;
