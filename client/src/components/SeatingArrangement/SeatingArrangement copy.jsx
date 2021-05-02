import React, { Fragment, useEffect, useState } from 'react';
import DropDown from '../layout/DropDown';
import saveAs from 'file-saver';
import ExcelJS from 'exceljs';
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
import {
  oddSems,
  evenSems,
  headers,
  headerFill,
  border,
  headerFont,
  alignment,
  subHeader1Fill,
  subHeader2Fill,
  colnumString,
  dataFont,
} from '../../utils/defaults';
import { getResources } from '../../actions/resources';
import { setAlert } from '../../actions/alert';
import { getExamScheduleSN } from '../../actions/exam_schedule';

const SeatingArrangement = () => {
  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const { examSchedule } = useSelector((state) => state.ExamSchedule);
  const { resources } = useSelector((state) => state.Resources);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);

  const initialState = {
    classroom: false,
    lab: false,
    selectedFile: null,
    testName: '',
    studentList: null,
    loading: false,
  };
  const [formData, setFormData] = useState({ ...initialState });

  const {
    classroom,
    testName,
    lab,
    selectedFile,
    studentList,
    loading,
  } = formData;

  // Fetch institutes from database if institues are not available
  useEffect(() => {
    if (institutes.length === 0) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institutes]);

  // Fetch resources for current degree
  useEffect(() => {
    degree &&
      dispatch(
        getResources({
          degreeId: institutes
            .filter((inst) => inst.instituteName === institute)[0]
            .degrees.filter((deg) => deg.degreeName === degree)[0]._id,
        })
      );
  }, [dispatch, institute, institutes, degree]);

  // Update state when checkbox value changes
  const handleCheckBoxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // Fetch exam schedule when testName changes
  useEffect(() => {
    testName &&
      academicYear &&
      dispatch(
        getExamScheduleSN({
          semesterNo,
          academicYear: academicYears.filter(
            (ay) => ay.year === academicYear
          )[0]._id,
          testName,
        })
      );
  }, [testName, dispatch, academicYear, academicYears, semesterNo]);

  // Map students to rooms based on rooms capacity
  const mapStudents = (arrangement, id, noOfStudents, rooms) => {
    arrangement = [
      arrangement,
      ...rooms.map((room, i) => {
        if (id >= noOfStudents) return null;
        let row1 = studentList.getRow(id),
          row2 = studentList.getRow(
            id + room.examCapacity > noOfStudents
              ? noOfStudents
              : id + room.examCapacity - 1
          );
        let tableRow = (
          <tr key={i}>
            <th>{room.code}</th>
            {examSchedule.schedule.map((_, i) => {
              return (
                <td key={i}>
                  {row1.getCell(2).value + ' to ' + row2.getCell(2).value}
                </td>
              );
            })}
          </tr>
        );
        id += room.examCapacity;
        return tableRow;
      }),
    ];
    return { arrangement, id };
  };

  // Map and render seating arrangement of students classroom or labwise
  const mapResources = () => {
    const noOfStudents = studentList.actualRowCount;
    let id = 2,
      arrangement = [];
    if (classroom || (classroom && lab)) {
      let x = mapStudents(arrangement, id, noOfStudents, resources.classes);
      arrangement = x.arrangement;
      id = x.id;
      if (lab) {
        let x = mapStudents(arrangement, id, noOfStudents, resources.labs);
        arrangement = x.arrangement;
        id = x.id;
      }
    } else if (lab) {
      let x = mapStudents(arrangement, id, noOfStudents, resources.labs);
      arrangement = x.arrangement;
      id = x.id;
    }
    // if (classroom && lab) console.log('classroom and lab');
    if (id < noOfStudents)
      return (
        <tr style={{ backgroundColor: 'white' }}>
          <td colSpan={examSchedule.schedule.length + 1}>
            <div className='alert alert-danger' role='alert'>
              Not enough resources please select more resources.
            </div>
          </td>
        </tr>
      );
    return arrangement;
  };

  // Load studentList from the selected xlsx file
  const loadWorksheet = async () => {
    setFormData((state) => ({
      ...state,
      loading: true,
    }));
    let file = selectedFile.name.split('.');
    let fileExtension = file[file.length - 1];
    const workbook = new ExcelJS.Workbook();
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      await workbook.xlsx.load(selectedFile);
      setFormData((state) => ({
        ...state,
        studentList: workbook.worksheets[0],
        loading: false,
      }));
      dispatch(setAlert('File upload complete.', 'success'));
    } else
      dispatch(setAlert('Selected file is not of proper format.', 'danger'));
  };

  // Render subjectname and exam timing for each exam
  const getHeaders = () => {
    if (examSchedule) {
      return (
        <Fragment>
          <tr>
            <th rowSpan='2'>Room no.</th>
            {examSchedule.schedule.map((schedule, i) => {
              return (
                <th key={i}>
                  {schedule.subjectId.subjectCode +
                    ' - ' +
                    schedule.subjectId.subjectName}
                </th>
              );
            })}
          </tr>
          <tr>
            {examSchedule.schedule.map((schedule, i) => {
              return (
                <th
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html:
                      'On: ' +
                      schedule.from.split(',')[0] +
                      '</br> From: ' +
                      schedule.from.split(',')[1] +
                      ' To: ' +
                      schedule.to.split(',')[1],
                  }}
                ></th>
              );
            })}
          </tr>
        </Fragment>
      );
    }
  };

  const excelExport = (e) => {
    e.preventDefault();

    // Create new Excel file ans name it
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet('Seating Arrangement');
    let sheetHeaders = [
      ...headers,
      `Academic Year (${academicYear}) ${semesterGroup} SEMESTER (SEMESTER: ${semesterNo})`,
      'Seating Arrangement',
    ];
    const totalCols = 3 + examSchedule.schedule.length * 4;
    let cols = [['B', 'C']];
    for (let i = 4; i < totalCols; i += 4) {
      cols.push([colnumString(i), colnumString(3 + i)]);
    }

    let titles = [
      'Room No.',
      ...examSchedule.schedule.map(
        (schedule) =>
          schedule.subjectId.subjectCode +
          ' - ' +
          schedule.subjectId.subjectName
      ),
    ];
    let timing = [
      '',
      ...examSchedule.schedule.map(
        (schedule) =>
          'On: ' +
          schedule.from.split(',')[0] +
          ' From: ' +
          schedule.from.split(',')[1] +
          ' To: ' +
          schedule.to.split(',')[1]
      ),
    ];

    // Add header to the worksheet
    for (let i = 1; i <= totalCols; i++) {
      if (i <= sheetHeaders.length) {
        worksheet.mergeCells(i, 2, i, totalCols);
        const cell = worksheet.getCell(`B${i}`);
        cell.fill = headerFill;
        cell.border = border;
        cell.value = sheetHeaders[i - 1].toUpperCase();
      } else if (i === sheetHeaders.length + 1) {
        for (let j = 0; j < titles.length; j++) {
          worksheet.mergeCells(
            `${cols[j][0]}${i}:${cols[j][1]}${j === 0 ? i + 3 : i + 1}`
          );
          let cell = worksheet.getCell(`${cols[j][0]}${i}`);
          cell.border = border;
          cell.fill = subHeader1Fill;
          cell.value = titles[j];
          if (j > 0) {
            worksheet.mergeCells(`${cols[j][0]}${i + 2}:${cols[j][1]}${i + 3}`);
            let cell = worksheet.getCell(`${cols[j][0]}${i + 2}`);
            cell.border = border;
            cell.fill = subHeader2Fill;
            cell.value = timing[j];
          }
        }
      }
      worksheet.getColumn(i).font = headerFont;
      worksheet.getColumn(i).alignment = alignment;
    }

    let sheetRow = sheetHeaders.length + 5;
    let table = document.getElementById('tblSeatingArrangements');

    // Read cells from HTML table and add it to worksheet
    for (var i = 2, row; (row = table.rows[i]); i++, sheetRow++) {
      for (var j = 0, col; (col = row.cells[j]); j++) {
        worksheet.mergeCells(
          `${cols[j][0]}${sheetRow}:${cols[j][1]}${sheetRow}`
        );
        let cell = worksheet.getCell(`${cols[j][0]}${sheetRow}`);
        cell.font = dataFont;
        cell.border = border;
        cell.value = col.innerHTML;
      }

      var wkst = ExcelJSWorkbook.addWorksheet(row.cells[0].innerHTML);
      // Add header to the worksheet
      for (let i = 1; i <= totalCols; i++) {
        if (i <= sheetHeaders.length) {
          wkst.mergeCells(i, 2, i, totalCols);
          const cell = wkst.getCell(`B${i}`);
          cell.fill = headerFill;
          cell.border = border;
          cell.value = sheetHeaders[i - 1].toUpperCase();
        } else if (i === sheetHeaders.length + 1) {
        }
        wkst.getColumn(i).font = headerFont;
        wkst.getColumn(i).alignment = alignment;
      }
    }

    // Create excel file from the create worksheet and save it
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Seating Arrangement(${testName}).xlsx`
      );
    });
  };

  // Designing of the page
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className='row py-3'>
        <div className='col-md-4'>
          <div className='card h-100 shadow'>
            {/* Content of Card-1/firstCard */}
            <div className='card-body'>
              <h3 className='text-center'>SEATING ARRANGEMENT</h3>{' '}
              <Fragment>
                <DropDown
                  id='ddInstitute'
                  title='Institute'
                  options={institutes.map((inst) => {
                    return inst.instituteName;
                  })}
                  isDisabled={false}
                  value={institute}
                  onChange={(e) => {
                    dispatch(updateInstitute(e.target.value));
                    dispatch(updateDegree(null));
                    dispatch(updateAcademicYear(null));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
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
                  onChange={(e) => {
                    dispatch(updateDegree(e.target.value));
                    dispatch(updateAcademicYear(null));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
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
                  onChange={(e) => {
                    dispatch(updateAcademicYear(e.target.value));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
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
                      onChange={(e) => {
                        dispatch(updateSemesterGroup(e.target.value));
                        dispatch(updateSemesterNo(null));
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
                        setFormData({ ...initialState });
                      }}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col'></div>
                </div>
                <div className='row'>
                  <div className='col-md'>
                    <DropDown
                      title='Name Of Component'
                      options={['Unit Test 1', 'Unit Test 2']}
                      id='ddNameOfComponents'
                      onChange={(e) => {
                        setFormData({
                          ...initialState,
                          testName: e.target.value,
                        });
                      }}
                      isDisabled={semesterNo ? false : true}
                      value={testName}
                    />
                  </div>
                  <div className='col-md'>
                    <div className='form-group'>
                      <label className='form-label'>Resources</label>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value=''
                          name='classroom'
                          id='chkClassroom'
                          checked={classroom}
                          onChange={(e) => {
                            handleCheckBoxChange(e);
                          }}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='chkClassroom'
                        >
                          Classroom
                        </label>
                      </div>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value=''
                          name='lab'
                          id='chkLab'
                          checked={lab}
                          onChange={(e) => {
                            handleCheckBoxChange(e);
                          }}
                        />
                        <label className='form-check-label' htmlFor='chkLab'>
                          Labs
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        <div className='col-md-8'>
          <div className='card h-100 shadow'>
            {/* Content of Card-3/thirdCard */}
            {semesterNo && testName && examSchedule && (
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-9'>
                    <div className='row'>
                      <div className='col'>
                        <p className='form-label h5 d-block'>
                          Please select a student list in
                          <span
                            className='btn btn-link text-monospace'
                            onClick=''
                          >
                            FORMAT
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className='input-group mb-3'>
                      <div className='custom-file'>
                        <input
                          type='file'
                          id='inpFile'
                          className='custom-file-input'
                          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                          onChange={(e) => {
                            setFormData((state) => ({
                              ...state,
                              selectedFile: e.target.files[0],
                            }));
                          }}
                          required
                        />
                        <label className='custom-file-label'>
                          {selectedFile ? selectedFile.name : 'Choose file'}
                        </label>
                      </div>
                      <div className='input-group-append'>
                        <div className='input-group-append'>
                          <button
                            className='btn btn-secondary'
                            type='button'
                            onClick={(e) => {
                              classroom || lab
                                ? selectedFile
                                  ? loadWorksheet()
                                  : dispatch(
                                      setAlert(
                                        'Please select a file first.',
                                        'danger'
                                      )
                                    )
                                : dispatch(
                                    setAlert(
                                      'Please select a resource first.',
                                      'danger'
                                    )
                                  );
                            }}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    {!loading && studentList && (
                      <button
                        type='button'
                        className='btn btn-outline-dark float-right'
                        onClick={(e) => excelExport(e)}
                      >
                        Export Data <i className='fa fa-download'></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className='row'>
                  <div className='col'>
                    {loading ? (
                      <div className='d-flex align-items-center'>
                        <strong>Calculating...</strong>
                        <div
                          className='spinner-border ml-auto'
                          role='status'
                          aria-hidden='true'
                        ></div>
                      </div>
                    ) : (
                      <div className='table-responsive'>
                        <table
                          id='tblSeatingArrangements'
                          className='table table-striped table-sm text-center'
                        >
                          <thead>{getHeaders()}</thead>
                          <tbody>
                            {studentList && resources && mapResources()}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SeatingArrangement;
