import React from 'react';
import PropTypes from 'prop-types';

const DropDown = ({ title, options }) => {
  return (
    <div className='mb-3 form-group'>
      <label htmlFor={'dp' + title} className='form-label'>
        {title}
      </label>
      <select className='form-select form-control' id={'dp' + title}>
        <option selected disabled>
          Select Option
        </option>
        {options.map((option) => (
          <option key={options.indexOf(option)} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

DropDown.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
};

export default DropDown;
