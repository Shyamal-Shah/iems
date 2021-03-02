import React from 'react';
import PropTypes from 'prop-types';
import DropDown from '../layout/DropDown';

const Component = ({ index }) => {
  return (
    <div className='row'>
      <div className='col'>
        <DropDown
          title={'C' + index + '-Name'}
          options={[
            'Unit Test',
            'Assignment',
            'Project',
            'Quizes',
            'Research Work',
            'Attendence',
          ]}
        />
      </div>
      <div className='col'>
        <DropDown
          title={'C' + index + '-Mode'}
          options={['Online', 'Offline']}
        />
      </div>

      <div className='col'>
        <div class='mb-3 form-group'>
          <label for={'txt' + index + '-Weightage'} class='form-label'>
            {'C' + index + '-Weightage'}
          </label>
          <input
            className='form-control'
            type='tel'
            id={'txt' + index + '-Weightage'}
            pattern='^(\d|1\d|2\d|30)$'
          />
        </div>
      </div>
    </div>
  );
};

Component.propTypes = {
  index: PropTypes.number,
};

export default Component;
