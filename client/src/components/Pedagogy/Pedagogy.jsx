import React, { useState } from 'react';
import DropDown from '../layout/DropDown';
import Component from './Component';
import { useSelector } from 'react-redux';

const Pedagogy = () => {
  const currentState = useSelector((state) => state.CurrentState);

  const [formData, setFormData] = useState({
    subjectName: null,
    noOfComponents: 1,
  });

  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

  const { subjectName, noOfComponents } = formData;

  const renderComponents = () => {
    const components = [];
    for (let index = 0; index < noOfComponents; index++) {
      components.push([
        <Component
          index={index + 1}
          key={index}
          cMode={formData['c' + index + '-Mode']}
          cName={formData['c' + index + '-Name']}
          cWeightage={formData['c' + index + '-Weightage']}
          onNameChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Name']: e.target.value,
            });
          }}
          onModeChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Mode']: e.target.value,
            });
          }}
          onWeightageChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Weightage']: e.target.value,
            });
          }}
        />,
      ]);
    }
    return components;
  };
  return (
    <form>
      <div className='row py-3'>
        <div className='col-md-3 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <DropDown
                title='Institute'
                options={['CSPIT', 'DEPSTAR', 'RPCC']}
                value={institute}
              />
              <DropDown
                title='Degree'
                options={['B.tech(CE)', 'B.tech(CSE)', 'B.tech(IT)']}
                value={degree}
              />
              <DropDown
                title='Academic Year'
                options={['2020-2021']}
                value={academicYear}
              />
              <DropDown
                title='Semesters'
                options={['Even', 'Odd']}
                value={semesterGroup}
              />
              <DropDown
                value={semesterNo}
                title='Semester No.'
                options={['1', '2', '3', '4', '5', '6', '7', '8']}
              />
            </div>
          </div>
        </div>
        <div className='col-md-3 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <h3 className='text-center'>PEDAGOGY</h3>
              <DropDown
                title='Subject'
                options={[
                  'Subject-1',
                  'Subject-2',
                  'Subject-3',
                  'Subject-4',
                  'Subject-5',
                ]}
                id='ddSubjects'
                onChange={(e) => {
                  setFormData({ ...formData, subjectName: e.target.value });
                }}
                isDisabled={false}
                value={subjectName}
              />
              <DropDown
                title='Number of Components'
                id='ddNoOfComponents'
                isDisabled={false}
                value={noOfComponents}
                onChange={(e) => {
                  setFormData({ ...formData, noOfComponents: e.target.value });
                }}
                options={['1', '2', '3', '4', '5']}
              />
            </div>
          </div>
        </div>
        <div className='col-md-6 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              {renderComponents()}
              <input type='submit' value='Submit' className='btn btn-primary' />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Pedagogy;
