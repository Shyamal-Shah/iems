import React,{useEffect} from 'react';
import DropDown from './DropDown';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getInstitutes} from '../../actions/institutes_degree'
import {getAcademicYear} from '../../actions/academic_year'

const Dashboard = ({getInstitutes,institutes,getAcademicYear,academicYear}) => {
  
  useEffect(()=>{
    getInstitutes();
    getAcademicYear();
  },[getInstitutes,institutes,getAcademicYear,academicYear])

  return (
    <div className='row py-3' style={{ minHeight: '' }}>
      <div className='col-lg'></div>
      <div className='col-lg'>
        <div className='card h-100 shadow'>
          <div className='card-body'>
            <form>
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
            </form>
          </div>
        </div>
      </div>
      <div className='col-lg'></div>
    </div>
  );
};

Dashboard.propTypes = {
  getInstitutes:PropTypes.func.isRequired,
  institutes:PropTypes.object.isRequired,
  getAcademicYear:PropTypes.func.isRequired,
  academicYear:PropTypes.array.isRequired,
}

const mapStateToProps = state =>({
  institutes:state.institutes,
  academicYear:state.academicYear
})

export default connect(mapStateToProps,{getInstitutes,getAcademicYear})(Dashboard);
