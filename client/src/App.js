import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if (localStorage.getItem('token')) {
  setAuthToken(localStorage.getItem('token'));
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section style={{ marginTop: '100px' }} className='container-fluid'>
            <Alert />
            <Route exact path='/' component={Login} />
            <Switch>
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
