import React,{useEffect} from 'react';
import DropDown from './DropDown';
import {connect, useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {getInstitutes} from '../../actions/institutes_degree'
import {getAcademicYear} from '../../actions/academic_year'

const Dashboard = () => {
  const dispatch = useDispatch()
  const {institutes, loading, error } = useSelector(state => state.InstituteDegree)
  const {academicYear } = useSelector(state => state.AcademicYear)

  useEffect(()=>{
    dispatch(getInstitutes());
    dispatch(getAcademicYear());
  },[loading])

  return (
    <div className='row py-3' style={{ minHeight: '' }}>
      <div className='col-lg'></div>
      <div className='col-lg'>
        <div className='card h-100 shadow'>
          <div className='card-body'>
            <form>
              <DropDown
                title='Institute'
                options={institutes.map(inst=>{ return inst.instituteName})}
              />
              
              <DropDown
                title='Degree'
                options={['B.tech(CE)', 'B.tech(CSE)', 'B.tech(IT)']}
              />
              <DropDown title='Academic Year' options={academicYear.map(ay=>{ return ay.year})} />
              <DropDown title='Semesters' options={['Even', 'Odd']} />
              <DropDown
                title='Semester No.'
                options={['1', '2', '3', '4', '5', '6', '7', '8']}
              />
            </form>
          </div>
        </div>
      </div>
      <div className='col-lg'></div>
    </div>
  );
};



export default (Dashboard);
