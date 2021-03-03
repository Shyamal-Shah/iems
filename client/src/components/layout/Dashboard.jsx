import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DropDown from './DropDown';
import { getInstitutes } from '../../actions/institutes_degree';
import { getAcademicYear } from '../../actions/academic_year';

import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from '../../actions/current';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);

  useEffect(() => {
    dispatch(getInstitutes());
    dispatch(getAcademicYear());
  }, [dispatch]);

  const oddSems = ['1', '3', '5', '7'];
  const evenSems = ['2', '4', '6', '8'];

  const currentState = useSelector((state) => state.CurrentState);

  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

  return (
    <Fragment>
      <div className='row py-3'>
        <div className='col-lg'></div>
        <div className='col-lg'>
          <form>
            <div className='card h-100 shadow'>
              <div className='card-body'>
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
                          .degrees.map((degree) => degree.degreeName)
                      : []
                  }
                  value={degree}
                  isDisabled={degree ? false : true}
                  onChange={async (e) => {
                    await dispatch(updateDegree(e.target.value));
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
                  isDisabled={academicYear ? false : true}
                  onChange={async (e) => {
                    await dispatch(updateAcademicYear(e.target.value));
                    let drp = document.getElementById('ddSemesterGroup');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddSemesterGroup'
                  title='Semester Group'
                  options={['Even', 'Odd']}
                  value={semesterGroup}
                  isDisabled={semesterGroup ? false : true}
                  onChange={async (e) => {
                    dispatch(updateSemesterGroup(e.target.value));
                    await dispatch(updateSemesterNo(null));
                    let drp = document.getElementById('ddSemesterNo');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddSemesterNo'
                  title='Semester No.'
                  value={semesterNo}
                  isDisabled={semesterNo ? false : true}
                  options={'Even' === semesterGroup ? evenSems : oddSems}
                  onChange={(e) => {
                    dispatch(updateSemesterNo(e.target.value));
                  }}
                />
                <br />
                {semesterNo && (
                  <Fragment>
                    <div className='row'>
                      <div className='col-md-7'>
                        <Link
                          className='btn btn-outline-info w-100 mb-3'
                          to='/neList'
                        >
                          Not-eligibilty List
                        </Link>
                      </div>
                      <div className='col-md-5'>
                        <Link
                          className='btn btn-outline-info w-100 -3 mb-3'
                          to='/pedagogy'
                        >
                          Pedagogy
                        </Link>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-5'>
                        <Link
                          className='btn btn-outline-info w-100 mb-3'
                          to='examSchedule'
                        >
                          Exam Schedule
                        </Link>
                      </div>
                      <div className='col-md-7'>
                        <Link
                          className='btn btn-outline-info w-100 mb-3'
                          to='seatingArrangement'
                        >
                          Seating Arrangement
                        </Link>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className='col-md'></div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
