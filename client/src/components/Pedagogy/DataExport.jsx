import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import {
  getPedagogyAY,
  getPedagogySG,
  getPedagogySN,
} from '../../actions/pedagogy';
import {
  alignment,
  border,
  dataFont,
  headerFill,
  headerFont,
  subHeaderFill,
} from '../../utils/defaults';

function DataExport() {
  const { expType } = useParams();
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const currentState = useSelector((state) => state.CurrentState);
  const { pedagogies } = useSelector((state) => state.Pedagogy);
  const dispatch = useDispatch();

  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

  useEffect(() => {
    if (academicYears.length > 0) {
      const AYId = academicYears.filter((ay) => ay.year === academicYear)[0]
        ._id;
      switch (expType) {
        case 'Academic Year':
          dispatch(getPedagogyAY({ academicYear: AYId }));
          break;
        case 'Semester Group':
          dispatch(getPedagogySG({ semesterGroup, academicYear: AYId }));
          break;
        case 'Semester Number':
          dispatch(getPedagogySN({ semesterNo, academicYear: AYId }));
          break;
        default:
          break;
      }
    }
  }, []);

  const renderPedagogies = (pedagogies) => {
    return (
      pedagogies.length > 0 && (
        <Fragment>
          {pedagogies.map(({ subject, components }, j) => {
            return (
              <Fragment>
                <thead key={j}>
                  <tr>
                    <th colSpan='4' scope='col' className='text-center'>
                      {subject.subjectCode + ' - ' + subject.subjectName}
                    </th>
                  </tr>
                  <tr>
                    <th scope='col'>Sr. No.</th>
                    <th scope='col'>Component</th>
                    <th scope='col'>Mode</th>
                    <th scope='col'>Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component, i) => {
                    return (
                      <Fragment>
                        <tr key={i}>
                          <th style={{ padding: '0.5rem' }} scope='row'>
                            {i + 1}
                          </th>
                          <td style={{ padding: '0.5rem' }}>
                            {component.name}
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            {component.mode}
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            {component.weightAge}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </Fragment>
            );
          })}
        </Fragment>
      )
    );
  };

  const renderSemesterPedagogies = (semesterGroup) => {
    let semesters = [];
    if (semesterGroup === 'Even') semesters = [2, 4, 6, 8];
    else if (semesterGroup === 'Odd') semesters = [1, 3, 5, 7];
    else semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    return semesters.map((i) => (
      <Fragment>
        <thead key={i}>
          <tr>
            <th colSpan='4' scope='col'>
              Semester: {i}
            </th>
          </tr>
        </thead>
        {renderPedagogies(
          pedagogies.filter((pedagogy) => pedagogy.semester === i)
        )}
      </Fragment>
    ));
  };

  const addPedagogies = (pedagogies, worksheet, row) => {
    for (let i = 0; i < pedagogies.length; i++) {
      const { subject, components } = pedagogies[i];
      // Row For SubjectName
      worksheet.mergeCells(`B${row}:K${row}`);
      let cell = worksheet.getCell(`B${row}`);
      cell.fill = subHeaderFill;
      cell.border = border;
      cell.value =
        subject.subjectCode + ' - ' + subject.subjectName.toUpperCase();
      row++;
      // Loop Through components
      for (let k = 0; k <= components.length; k++) {
        cell = worksheet.getCell(`B${row}`);
        cell.value = k !== 0 ? k : 'Sr.No';
        cell.border = border;
        worksheet.mergeCells(`C${row}:E${row}`);
        cell = worksheet.getCell(`C${row}`);
        cell.font = k !== 0 ? dataFont : headerFont;
        cell.border = border;
        cell.value = k !== 0 ? components[k - 1].name : 'Component';
        worksheet.mergeCells(`F${row}:H${row}`);
        cell = worksheet.getCell(`F${row}`);
        cell.font = k !== 0 ? dataFont : headerFont;
        cell.border = border;
        cell.value = k !== 0 ? components[k - 1].mode : 'Mode';
        worksheet.mergeCells(`I${row}:K${row}`);
        cell = worksheet.getCell(`I${row}`);
        cell.font = k !== 0 ? dataFont : headerFont;
        cell.border = border;
        cell.value = k !== 0 ? components[k - 1].weightAge : 'WeightAge';
        row++;
      }
    }
    return { worksheet, row };
  };

  const excelExport = (btn) => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet('Pedagogy');
    const headers = [
      'Charotar University of Science and Technology, Changa',
      institute + ' ' + degree,
      expType === 'Academic Year'
        ? `Academic Year (${academicYear})`
        : expType === 'Semester Group'
        ? `Academic Year (${academicYear}) ${semesterGroup} SEMESTER`
        : `Academic Year (${academicYear}) ${semesterGroup} SEMESTER (SEMESTER: ${semesterNo})`,
      'PEDAGOGY',
    ];

    for (let i = 2; i <= 11; i++) {
      worksheet.getColumn(i).font = headerFont;
      worksheet.getColumn(i).alignment = alignment;
    }
    for (let i = 1; i <= 4; i++) {
      worksheet.mergeCells(`B${i}:K${i}`);
      const cell = worksheet.getCell(`B${i}`);
      cell.fill = headerFill;
      cell.border = border;
      cell.value = headers[i - 1].toUpperCase();
    }

    switch (expType) {
      case 'Academic Year':
        for (let i = 1, row = 5; i <= 8; i++) {
          worksheet.mergeCells(`B${row}:K${row}`);
          let cell = worksheet.getCell(`B${row}`);
          cell.fill = subHeaderFill;
          cell.border = border;
          cell.value = `Semester: ${i}`;
          row++;
          const x = addPedagogies(
            pedagogies.filter((pedagogy) => pedagogy.semester === i),
            worksheet,
            row
          );
          worksheet = x.worksheet;
          row = x.row;
        }
        break;
      case 'Semester Group':
        for (
          let i = semesterGroup === 'Even' ? 2 : 1, row = 5;
          i <= 8;
          i += 2
        ) {
          worksheet.mergeCells(`B${row}:K${row}`);
          let cell = worksheet.getCell(`B${row}`);
          cell.fill = subHeaderFill;
          cell.border = border;
          cell.value = `Semester: ${i}`;
          row++;
          const x = addPedagogies(
            pedagogies.filter((pedagogy) => pedagogy.semester === i),
            worksheet,
            row
          );
          worksheet = x.worksheet;
          row = x.row;
        }
        break;
      case 'Semester Number':
        const x = addPedagogies(pedagogies, worksheet, 5);
        worksheet = x.worksheet;
        break;
      default:
        break;
    }
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Pedagogy(${academicYear}).xlsx`
      );
    });
  };

  return expType &&
    institute &&
    degree &&
    academicYear &&
    semesterGroup &&
    semesterNo ? (
    <div className='row py-3' style={{ lineHeight: 1.15 }}>
      <div className='col-md'>
        <div className='card shadow-sm'>
          <div className='card-header bg-primary text-white'>
            <p className='h2 text-center'>
              <u style={{ letterSpacing: '0.0325em' }}>PEDAGOGY</u>
            </p>
            <button
              type='button'
              className='btn btn-light float-right'
              onClick={(e) => excelExport(e)}
            >
              Export Data <i className='fa fa-download'></i>
            </button>
          </div>
          <div className='card-body '>
            <div className='row pb-3'>
              <div className='col-md text-center'>
                <p className='h3'>
                  <u>Charotar University of Science and Technology, Changa</u>
                </p>
              </div>
            </div>
            <div className='row'>
              <div className='col text-center'>
                <p className='h5'>Institute: {institute} </p>
              </div>
            </div>
            <div className='row p-3'>
              <div
                className={
                  expType === 'Academic Year' ? 'col' : 'col-md-6 text-center'
                }
              >
                <p className='h5'>Degree: {degree} </p>
                <p className='h5'>Academic Year: {academicYear}</p>
              </div>
              <div className='col-md-6 text-center'>
                {expType === 'Semester Group' && (
                  <p className='h5'>Semester Group: {semesterGroup}</p>
                )}
                {expType === 'Semester Number' && (
                  <Fragment>
                    <p className='h5'>Semester Group: {semesterGroup}</p>
                    <p className='h5'>Semester Number: {semesterNo}</p>
                  </Fragment>
                )}
              </div>
            </div>
            <div className='row mx-1 overflow-auto'>
              <table className='table table-striped'>
                {expType === 'Semester Number' && renderPedagogies(pedagogies)}
                {expType === 'Semester Group' &&
                  renderSemesterPedagogies(semesterGroup)}
                {expType === 'Academic Year' && renderSemesterPedagogies(null)}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/pedagogy' />
  );
}

export default DataExport;
