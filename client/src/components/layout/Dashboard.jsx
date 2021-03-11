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
  const { institutes, loading } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);

  useEffect(() => {
    dispatch(getInstitutes());
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
    !loading && (
      <Fragment>
        <div className='row py-3'>
          <div className='col-lg'></div>
          <div className='col-lg'>
            <form>
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
                              .filter(
                                (inst) => inst.instituteName === institute
                              )[0]
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
                              .filter(
                                (inst) => inst.instituteName === institute
                              )[0]
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
                          options={
                            'Even' === semesterGroup ? evenSems : oddSems
                          }
                          onChange={(e) => {
                            dispatch(updateSemesterNo(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                  </Fragment>
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
    )
  );
};

export default Dashboard;
