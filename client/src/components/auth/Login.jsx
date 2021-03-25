import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

const Login = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <div className='row'>
        <div className='col-md'></div>
        <div className='col-md'>
          <div className='card my-4 shadow p-2'>
            <div className='card-body'>
              <p className='card-header h2'>
                Login
              </p>
              <form
                className='pt-4'
                onSubmit={(e) => {
                  onSubmit(e);
                }}
              >
                <div className='row'>
                  <div className='col'>
                    <div className='mb-3'>
                      <label htmlFor='txtemail' className='form-label'>
                        Email address
                      </label>
                      <input
                        type='email'
                        className='form-control'
                        id='txtemail'
                        name='email'
                        aria-describedby='emailHelp'
                        autoComplete='username'
                        onChange={(e) => {
                          onChange(e);
                        }}
                        value={email}
                        // required
                      />
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col'>
                    <div className='mb-3'>
                      <label htmlFor='txtpassword' className='form-label'>
                        Password
                      </label>
                      <input
                        type='password'
                        className='form-control'
                        id='txtpassword'
                        name='password'
                        minLength='6'
                        autoComplete='current-password'
                        onChange={(e) => {
                          onChange(e);
                        }}
                        value={password}
                        // required
                      />
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col text-center'>
                    <button type='submit' className='btn btn-primary mx-auto'>
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='col-md'></div>
      </div>
    </Fragment>
  );
};

export default Login;
