import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import DropDown from '../layout/DropDown';
import Component from './Component';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from '../../actions/current';
import { getInstitutes } from '../../actions/institutes_degree';
import { getAcademicYear } from '../../actions/academic_year';
import { oddSems, evenSems } from '../../utils/defaults';

const ExamSchedule = () => {
  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const currentState = useSelector((state) => state.CurrentState);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

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

  useEffect(() => {
    if (institute == null) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institute]);

  return (
    <form>
      <div className='row py-3'>
        <div className='col-md-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <Fragment>
                <DropDown
                  id='ddInstitute'
                  title='Institute'
                  options={institutes.map((inst) => {
                    return inst.instituteName;
                  })}
                  isDisabled={false}
                  value={institute}
                  onChange={async (e) => {
                    await dispatch(updateInstitute(e.target.value));
                    await dispatch(updateDegree(null));
                    await dispatch(updateAcademicYear(null));
                    await dispatch(updateSemesterGroup(null));
                    await dispatch(updateSemesterNo(null));
                    let drp = document.getElementById('ddDegree');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddDegree'
                  title='Degree'
                  options={
                    institute
                      ? institutes
                          .filter((inst) => inst.instituteName === institute)[0]
                          .degrees.map((deg) => deg.degreeName)
                          .sort()
                      : []
                  }
                  value={degree}
                  isDisabled={institute ? false : true}
                  onChange={async (e) => {
                    await dispatch(updateDegree(e.target.value));
                    await dispatch(updateAcademicYear(null));
                    await dispatch(updateSemesterGroup(null));
                    await dispatch(updateSemesterNo(null));
                    dispatch(
                      getAcademicYear({
                        degreeId: institutes
                          .filter((inst) => inst.instituteName === institute)[0]
                          .degrees.filter(
                            (deg) => deg.degreeName === e.target.value
                          )[0]._id,
                      })
                    );
                    let drp = document.getElementById('ddAcademicYear');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddAcademicYear'
                  title='Academic Year'
                  options={academicYears.map((ay) => {
                    return ay.year;
                  })}
                  value={academicYear}
                  isDisabled={
                    degree !== null && institute !== null ? false : true
                  }
                  onChange={async (e) => {
                    await dispatch(updateAcademicYear(e.target.value));
                    await dispatch(updateSemesterGroup(null));
                    await dispatch(updateSemesterNo(null));
                    let drp = document.getElementById('ddSemesterGroup');
                    drp.disabled = false;
                  }}
                />
                <div className='row'>
                  <div className='col-md'>
                    <DropDown
                      id='ddSemesterGroup'
                      title='Semester Group'
                      options={['Even', 'Odd']}
                      value={semesterGroup}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null
                          ? false
                          : true
                      }
                      onChange={async (e) => {
                        dispatch(updateSemesterGroup(e.target.value));
                        await dispatch(updateSemesterNo(null));
                        let drp = document.getElementById('ddSemesterNo');
                        drp.disabled = false;
                      }}
                    />
                  </div>
                  <div className='col-md'>
                    <DropDown
                      id='ddSemesterNo'
                      title='Semester No.'
                      value={semesterNo}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null &&
                        semesterGroup !== null
                          ? false
                          : true
                      }
                      options={'Even' === semesterGroup ? evenSems : oddSems}
                      onChange={(e) => {
                        dispatch(updateSemesterNo(e.target.value));
                        setFormData({ subjectName: null, noOfComponents: 1 });
                      }}
                    />
                  </div>
                </div>
              </Fragment>
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
