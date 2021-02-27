import React, { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const authLinks = (
    <Fragment>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
          to='/pedagogy'
        >
          Pedagogy
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
          to='examSchedule'
        >
          Exam Schedule
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
          to='/neList'
        >
          Not-eligibilty List
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
          to='seatingArangement'
        >
          Seating Arangement
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
          to='/login'
        >
          Logout
        </Link>
      </li>
    </Fragment>
  );
  const guestLinks = (
    <li className='nav-item'>
      <Link
        className='nav-link btn btn-outline-info tab px-3 ml-3 mb-3'
        to='/login'
      >
        Login
      </Link>
    </li>
  );

  return (
    <nav
      className='navbar navbar-expand-lg fixed-top'
      style={{ backgroundColor: '#f1f1f1' }}
    >
      <Link className='navbar-brand' to='/'>
        <img
          src='https://www.charusat.ac.in/images/logo.png'
          className='logo img-fluid'
          alt='Logo'
          width='180px'
          height='70px'
        />
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#collapsibleNavbar'
      >
        <span className='navbar-toggler-icon text-light'></span>
      </button>

      <div
        className='collapse navbar-collapse justify-content-end'
        id='collapsibleNavbar'
      >
        <ul className='navbar-nav pt-3'>
          {authLinks}
          {guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
