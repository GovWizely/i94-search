import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers';

const middlewares = [thunk];
if (__DEVELOPMENT__) {
  const logger = createLogger();
  middlewares.push(logger);
}

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(...middlewares)
  );
}
