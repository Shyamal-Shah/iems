import React, { Fragment, useState, useEffect } from "react";
import DropDown from "../layout/DropDown";
import { Link } from "react-router-dom";
import { addPedagogy, getPedagogy } from "../../actions/pedagogy";
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from "../../actions/current";
import { getInstitutes } from "../../actions/institutes_degree";
import { getAcademicYear } from "../../actions/academic_year";
import { oddSems, evenSems } from "../../utils/defaults";
import { useDispatch, useSelector } from "react-redux";
import { addNE } from "../../actions/not_eligible";
const NEList = () => {
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

  const [formData, setFormData] = useState({
    academicYear: "",
    subjectName: "",
    nameOfComponents: "",
    semester: 1,
    studentId: [],
  });

  const [students, setStudents] = useState([]);
  const [inputStudent, setInputStudent] = useState("");

  const getSubjects = (semNo) => {
    return academicYears
      .filter((ay) => ay.year === academicYear)[0]
      .semesters.filter((sem) => sem.semesterNo === parseInt(semNo))[0]
      .subjects.map(({ subjectId }) => {
        return {
          subjectName: subjectId.subjectCode + "-" + subjectId.subjectName,
          id: subjectId._id,
        };
      });
  };

  // Fetch from institues if not available
  useEffect(() => {
    if (institute == null) {
      dispatch(getInstitutes());
    }
  }, []);

  const [subjects, setSubjects] = useState(
    academicYear && semesterNo && institute && degree && semesterGroup
      ? getSubjects(semesterNo).sort()
      : []
  );

  const [expType, setExpType] = useState("");
  const { subjectName, nameOfComponents, studentId } = formData;

  const onStudentIdChange = (e) => {
    setInputStudent(e.target.value);
  };

  function setStudentsArray() {
    students.push(inputStudent);
    setInputStudent("");
    console.log(students);
  }

  function removeStudentsArray(i) {
    const list = students.filter((item, j) => i !== j);
    setStudents(list);
  }

  useEffect(() => {
    subjectName && dispatch(getPedagogy({ subjectId: subjectName }));
  }, [subjectName, dispatch]);

  return (
    <form>
      <div className="row py-3">
        <div className="col-md-3">
          <div className="card h-100 shadow">
            <div className="card-body">
              <Fragment>
                <DropDown
                  id="ddInstitute"
                  title="Institute"
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

                    let drp = document.getElementById("ddDegree");
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id="ddDegree"
                  title="Degree"
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
                    let drp = document.getElementById("ddAcademicYear");
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id="ddAcademicYear"
                  title="Academic Year"
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
                    let drp = document.getElementById("ddSemesterGroup");
                    drp.disabled = false;
                  }}
                />
                <div className="row">
                  <div className="col-md">
                    <DropDown
                      id="ddSemesterGroup"
                      title="Semester Group"
                      options={["Even", "Odd"]}
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
                        let drp = document.getElementById("ddSemesterNo");
                        drp.disabled = false;
                      }}
                    />
                  </div>
                  <div className="col-md">
                    <DropDown
                      id="ddSemesterNo"
                      title="Semester No."
                      value={semesterNo}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null &&
                        semesterGroup !== null
                          ? false
                          : true
                      }
                      options={"Even" === semesterGroup ? evenSems : oddSems}
                      onChange={(e) => {
                        dispatch(updateSemesterNo(e.target.value));
                        setSubjects(getSubjects(e.target.value));
                        setFormData({ subjectName: null });
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="text-center">NOT ELIGIBILITY LIST</h3>
              <div className="mb-3 form-group">
                <label htmlFor="ddSubjects" className="form-label">
                  Subject Name
                </label>
                <select
                  id="ddSubjects"
                  className="form-select form-control"
                  onChange={(e) => {
                    setFormData({
                      subjectName: e.target.value,
                    });
                  }}
                  value={subjectName ? subjectName : ""}
                  disabled={semesterNo ? false : true}
                  required
                >
                  <option value="" disabled>
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
                title="Name of Components"
                id="ddNameOfComponents"
                isDisabled={semesterNo && subjectName ? false : true}
                value={nameOfComponents}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nameOfComponents: e.target.value,
                  });
                }}
                options={
                  pedagogy
                    ? pedagogy.components.map((component) => {
                        return component.name;
                      })
                    : []
                }
              />
              <DropDown
                title="Export Data For"
                id="ddExpData"
                isDisabled={semesterNo ? false : true}
                value={expType}
                onChange={(e) => {
                  setExpType(e.target.value);
                }}
                isRequired={false}
                options={["Subject", "Semister"]}
              />
              <Link
                to={"/pedagogy/export-data/" + expType}
                className={expType ? "btn btn-dark" : "btn btn-dark disabled"}
              >
                Export Data
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow">
            <div className="card-body">
              <div className="col-lg-6">
                <label>Student Id</label>

                <input
                  className="form-control"
                  placeholder="Student Id"
                  // pattern="^([A-Z][A-Z][-][0-9]+)_([a-zA-Z ]+)$"
                  title="Example: 18CE000"
                  required
                  value={inputStudent ? inputStudent : ""}
                  onChange={(e) => {
                    onStudentIdChange(e);
                  }}
                />
              </div>

              <div className="card-body">
                <input
                  value="Add"
                  type="button"
                  padding-left="0px"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setStudentsArray();
                  }}
                />
              </div>
              <div className="col-lg">
                {students ? (
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Student ID</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        return (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{s}</td>

                            <td>
                              <button
                                type="button"
                                class="btn btn-danger"
                                onClick={(e) => {
                                  removeStudentsArray(i);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : null}
              </div>
              <input
                value="Save"
                type="button"
                padding-left="0px"
                className="btn btn-primary"
                onClick={(e) => {
                  setFormData({
                    ...formData,
                    academicYear,
                    studentId: students,
                    semester: semesterNo,
                  });
                  dispatch(addNE(formData));
                  setStudents([]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NEList;
