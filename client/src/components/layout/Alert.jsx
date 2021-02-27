import React from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alerts = useSelector((state) => state.Alert);
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(({ id, msg, alertType }) => (
      <div key={id} className={'alert alert-' + alertType} role='alert'>
        {msg}
      </div>
    ))
  );
};

export default Alert;
