import React from 'react';
import PropTypes from 'prop-types';

const DropDown = ({
  id,
  title,
  options,
  onChange,
  value,
  isDisabled = true,
}) => {
  return (
    <div className='mb-3 form-group'>
      <label htmlFor={id} className='form-label'>
        {title}
      </label>
      <select
        id={id}
        className='form-select form-control'
        onChange={(e) => onChange(e)}
        value={value ? value : ''}
        disabled={isDisabled}
        required
      >
        <option value='' disabled>
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
