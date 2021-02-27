import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <section style={{ marginTop: '90px' }} className='container-fluid'>
          <Route exact path='/' component={Login} />
          <Switch>
            <Route exact path='/login' component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
