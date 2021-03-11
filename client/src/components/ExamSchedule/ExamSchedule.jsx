import React, { useState } from 'react';
import DropDown from '../layout/DropDown';
import moment from 'moment';
import Component from './Component';

const ExamSchedule = () => {
  const [formData, setFormData] = useState({
    examFrom: moment().format('yyyy-MM-DD'),
    examTo: moment().add(7, 'days').format('yyyy-MM-DD'),
    unitTest: '',
  });

  const { examFrom, examTo, unitTest } = formData;

  const onDateChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form>
      <div className='row py-3'>
        <div className='col-md-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <DropDown
                title='Institute'
                options={['CSPIT', 'DEPSTAR', 'RPCC']}
              />
              <DropDown
                title='Degree'
                options={['B.tech(CE)', 'B.tech(CSE)', 'B.tech(IT)']}
              />
              <DropDown title='Academic Year' options={['2020-2021']} />
              <DropDown title='Semesters' options={['Even', 'Odd']} />
              <DropDown
                title='Semester No.'
                options={['1', '2', '3', '4', '5', '6', '7', '8']}
              />
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <h3 className='text-center'>EXAM SCHEDULE</h3>
              <DropDown
                title='Internal-Examination'
                options={['Unit Test-1', 'Unit Test-2']}
                id='ddIE'
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    unitTest: e.target.value,
                  });
                }}
                isDisabled={false}
                value={unitTest}
              />
              <p className='h5'>Exam-week</p>

              <div className='form-group'>
                <label htmlFor='example-date-input'>From</label>
                <div>
                  <input
                    className='form-control'
                    type='date'
                    value={examFrom}
                    min={moment().format('yyyy-MM-DD')}
                    name='examFrom'
                    onChange={(e) => {
                      onDateChange(e);
                    }}
                  />
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='example-date-input'>To</label>
                <div>
                  <input
                    className='form-control'
                    type='date'
                    value={examTo}
                    min={examFrom}
                    name='examTo'
                    onChange={(e) => {
                      onDateChange(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <Component />
              <input type='submit' className='btn btn-primary' />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExamSchedule;
