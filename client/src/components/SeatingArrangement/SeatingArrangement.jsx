import React, { Fragment, useEffect, useState } from "react";
import DropDown from "../layout/DropDown";
import { useDispatch, useSelector } from "react-redux";
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
import { getPedagogySN } from "../../actions/pedagogy";

const SeatingArrangement = () => {
  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const currentState = useSelector((state) => state.CurrentState);
  const { pedagogies } = useSelector((state) => state.Pedagogy);

  const [formData, setFormData] = useState({
    subjectName: "",
    componentName: "",
    subjects: [],
  });

  // Destructure currentState
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = currentState;

  // Store the file name and data
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch from database if institues are not available
  useEffect(() => {
    if (institutes.length === 0) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institutes]);

  // Fetch pedagogies when semesterNo value changes
  useEffect(() => {
    semesterNo
      ? dispatch(
          getPedagogySN({
            academicYear: academicYears.filter(
              (ay) => ay.year === academicYear
            )[0]._id,
            semesterNo,
          })
        )
      : setFormData({ subjectName: "", componentName: "", neStudents: [] });
  }, [semesterNo, dispatch, academicYear, academicYears]);

  // Filter pedagogies of subjects if it has unit tests as components
  useEffect(() => {
    if (pedagogies !== null) {
      let subjectsTemp = pedagogies.map((pedagogy) => {
        let flag = false;
        pedagogy.components.forEach((component) => {
          if (
            component.name === "Unit Test 1" ||
            component.name === "Unit Test 2"
          )
            flag = true;
        });
        if (flag)
          return {
            subjectName:
              pedagogy.subject.subjectCode + "-" + pedagogy.subject.subjectName,
            id: pedagogy.subject._id,
          };
        else return undefined;
      });
      setFormData((state) => ({
        ...state,
        subjects: subjectsTemp.filter((subject) => subject !== undefined),
      }));
    }
  }, [pedagogies]);

  const { subjectName, componentName, subjects } = formData;

  // Designing of the page
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="row py-3">
        <div className="col-md-3">
          <div className="card h-100 shadow">
            {/* Content of Card-1/firstCard */}
            <div class="card-body">
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

                        setFormData({ ...formData, subjectName: null });
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
            {/* Content of Card-2/secondCard */}
            <div class="card-body">
              <h3 className="text-center">SEATING ARRANGEMENT</h3>
              <div className="mb-3 form-group">
                <label htmlFor="ddSubjects" className="form-label">
                  Subject
                </label>
                <select
                  id="ddSubjects"
                  className="form-select form-control"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      subjectName: e.target.value,
                      componentName: "",
                    });
                  }}
                  value={subjectName ? subjectName : ""}
                  disabled={semesterNo ? false : true}
                  required
                >
                  <option value="" disabled>
                    Select Option
                  </option>
                  {subjects
                    ? subjects.map((subject) => (
                        <option
                          key={subjects.indexOf(subject)}
                          value={subject.id}
                        >
                          {subject.subjectName}
                        </option>
                      ))
                    : []}
                </select>
              </div>
              <DropDown
                title="Name Of Component"
                options={
                  pedagogies.length > 0 && subjectName
                    ? pedagogies
                        .filter(
                          (pedagogy) => pedagogy.subject._id === subjectName
                        )[0]
                        .components.filter(
                          (component) =>
                            component.name === "Unit Test 1" ||
                            component.name === "Unit Test 2"
                        )
                        .map((component) => component.name)
                    : []
                }
                id="ddNameOfComponents"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    componentName: e.target.value,
                  });
                }}
                isDisabled={semesterNo && subjectName ? false : true}
                value={componentName}
              />
              <div className="form-check"></div>
              <label htmlFor="ddSubjects" className="form-label">
                Resources
              </label>
              <div style={{ padding: "3px" }}>
                <input
                  type="checkbox"
                  value="CR"
                  id="checkboxOneInput"
                  name=""
                />
                <label
                  for="checkboxOneInput"
                  style={{ padding: "3px", marginRight: "5px" }}
                >
                  {" "}
                  ClassRoom
                </label>

                <input
                  type="checkbox"
                  value="LB"
                  id="checkboxOneInput"
                  name=""
                />
                <label
                  for="checkboxOneInput"
                  style={{ padding: "3px", marginRight: "5px" }}
                >
                  {" "}
                  Lab
                </label>
              </div>
              {/* <Link
                  style={{ marginTop: '15px' }}
                  to={'/pedagogy/export-data/' + expType}
                  className={expType ? 'btn btn-dark' : 'btn btn-dark disabled'}
                >
                  Export Data
                </Link> */}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow">
            {/* Content of Card-3/thirdCard */}
            {componentName && (
              <div class="card-body">
                <div className="col-lg-6">
                  <div className="mb-3 form-group">
                    <label className="form-label">Students List</label>
                    <input
                      className="form-control-file"
                      type="file"
                      accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                        console.log(selectedFile);
                      }}
                      required
                    ></input>
                  </div>

                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-primary"
                    style={{ marginTop: "15px" }}
                  />
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
