import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alerts = useSelector((state) => state.Alert);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(({ id, msg, alertType }) => {
      return (
        <div
          tabIndex='-1'
          key={id}
          ref={ref}
          className={'alert alert-' + alertType}
          role='alert'
        >
          {msg}
        </div>
      );
    })
  );
};

export default Alert;
