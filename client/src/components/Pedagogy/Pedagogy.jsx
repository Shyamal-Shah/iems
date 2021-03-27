import React, { Fragment, useEffect, useState } from 'react';
import DropDown from '../layout/DropDown';
import Component from './Component';
import { useDispatch, useSelector } from 'react-redux';
import { addPedagogy, getPedagogy } from '../../actions/pedagogy';
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from '../../actions/current';
import { getInstitutes } from '../../actions/institutes_degree';
import { getAcademicYear } from '../../actions/academic_year';
import { setAlert } from '../../actions/alert';
import { Link } from 'react-router-dom';

const Pedagogy = () => {
  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const currentState = useSelector((state) => state.CurrentState);
  const { pedagogy } = useSelector((state) => state.Pedagogy);

  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

  const getSubjects = (semNo) => {
    return academicYears
      .filter((ay) => ay.year === academicYear)[0]
      .semesters.filter((sem) => sem.semesterNo === parseInt(semNo))[0]
      .subjects.map(({ subjectId }) => {
        return {
          subjectName: subjectId.subjectCode + '-' + subjectId.subjectName,
          id: subjectId._id,
        };
      });
  };

  const [formData, setFormData] = useState({
    subjectName: null,
    noOfComponents: 1,
  });

  const { subjectName, noOfComponents } = formData;

  const oddSems = ['1', '3', '5', '7'];
  const evenSems = ['2', '4', '6', '8'];

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

  useEffect(() => {
    if (institute == null) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institute]);

  useEffect(() => {
    subjectName && dispatch(getPedagogy({ subjectId: subjectName }));
  }, [subjectName, dispatch]);

  useEffect(() => {
    if (subjectName && pedagogy !== null) {
      setFormData({ ...formData, noOfComponents: pedagogy.components.length });
    } else {
      setFormData({ ...formData, noOfComponents: 1 });
    }
  }, [pedagogy]);

  useEffect(() => {
    if (subjectName && pedagogy !== null) {
      const fd = { ...formData };
      for (let i = 0; i < pedagogy.components.length; i++) {
        fd['c' + i + '-Name'] = pedagogy.components[i].name;
        fd['c' + i + '-Mode'] = pedagogy.components[i].mode;
        fd['c' + i + '-Weightage'] = pedagogy.components[i].weightAge;
      }
      setFormData(fd);
    } else {
      setFormData({
        noOfComponents,
        subjectName,
      });
    }
  }, [noOfComponents, subjectName]);

  const [subjects, setSubjects] = useState(
    academicYear && semesterNo && institute && degree && semesterGroup
      ? getSubjects(semesterNo).sort()
      : []
  );

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (subjectName) {
      let t = 0;
      for (let i = 0; i < formData.noOfComponents; i++) {
        if (!isNaN(parseInt(formData['c' + i + '-Weightage'])))
          t += parseInt(formData['c' + i + '-Weightage']);
      }
      setTotal(t);
    }
  }, [formData, subjectName]);

  useEffect(() => {
    if (total > 30) {
      console.log('hello');
      dispatch(setAlert('Total Weightage cannot excced 30.', 'danger'));
    }
  }, [total, dispatch]);

  const [expType, setExpType] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (total <= 30) {
          dispatch(addPedagogy(formData));
        } else {
          dispatch(setAlert('Total Weightage cannot excced 30.', 'danger'));
        }
      }}
    >
      <div className='row py-3'>
        <div className='col-md-3 pb-3'>
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
                        setSubjects(getSubjects(e.target.value));
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        <div className='col-md-3 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <h3 className='text-center'>PEDAGOGY</h3>
              <div className='mb-3 form-group'>
                <label htmlFor='ddSubjects' className='form-label'>
                  Subject
                </label>
                <select
                  id='ddSubjects'
                  className='form-select form-control'
                  onChange={async (e) => {
                    setFormData({
                      ...formData,
                      subjectName: e.target.value,
                    });
                  }}
                  value={subjectName ? subjectName : ''}
                  disabled={semesterNo && academicYear ? false : true}
                  required
                >
                  <option value='' disabled>
                    Select Option
                  </option>
                  {subjects.map((subject) => (
                    <option key={subjects.indexOf(subject)} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
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
              <DropDown
                title='Export Data For'
                id='ddExpData'
                isDisabled={false}
                value={expType}
                onChange={(e) => {
                  setExpType(e.target.value);
                }}
                options={['Academic Year', 'Semester Group', 'Semester Number']}
              />
              <Link to='/pedagogy/export-data' className='btn btn-dark'>
                Export Data
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-6 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              {renderComponents()}
              <div className='d-flex justify-content-between p-2'>
                <p className='h4'>Total:</p>
                <p className='h4'>{total}</p>
              </div>
              <input type='submit' value='Submit' className='btn btn-primary' />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};


export default Pedagogy;
