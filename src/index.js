import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import useQueries from 'history/lib/useQueries';
import configureStore from './configureStore';
import App from './containers/App';

function renderToElement(elementId, options) {
  const store = configureStore();
  const history = useQueries(createHistory)();

  render(
    <Provider store={store} key="provider">
      <App history={history} />
    </Provider>, document.getElementById(elementId));
}

export default renderToElement;
window.Explorer = {
  render: renderToElement,
};
