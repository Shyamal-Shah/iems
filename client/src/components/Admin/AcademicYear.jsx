import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addAcademicYear,
  addSemesters,
  deleteAY,
  getAcademicYear,
  updateAcademicYear,
} from "../../actions/academic_year";
import { setAlert } from "../../actions/alert";
import { getInstitutes } from "../../actions/institutes_degree";
import { getSubjects } from "../../actions/subject";
import SideNavbar from "./SideNavbar";

function AcademicYear() {
  // To call the actions
  const dispatch = useDispatch();

  // Get the institutes and degrees from the state
  const preInstitutes = useSelector(
    (state) => state.InstituteDegree.institutes
  );

  // Get the academic year according to degree id
  const preAcademicYear = useSelector(
    (state) => state.AcademicYear.academicYears
  );

  // Get the subjects according to degree selected by user
  const { subjects } = useSelector((state) => state.Subject);

  // Set the degrees according to selected institute
  const [degrees, setDegrees] = useState("");

  // Set the academic year from state
  const [academicYears, setAcademicYears] = useState([]);

  // Get the value from Academic year input fields
  const [academicYear, setAcademicYear] = useState("");

  // Get all the old data of academic Years
  const [oldAY, setOldAY] = useState([]);

  // Set the edited academicYear
  const [editAY, setEditAY] = useState({
    id: "",
    year: "",
  });

  // Set the degree which is selected by user
  const [formData, setFormData] = useState({
    degree: "",
    year: "",
    semesterNo: 0,
    subjects: [],
  });

  // Set the institutes which is fetched from state
  const [institutes, setInstitutes] = useState([]);

  // Set the semesters array for passing it in api
  const [semsub, setSemSub] = useState({
    sem: "",
    sub: "",
  });

  // An array to store the semesters and degrees
  const [subject, setSubject] = useState([]);

  // Fetch the institutes and degrees from the API and store it in state
  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  useEffect(() => {
    setAcademicYears([]);
    if (formData.degree) {
      dispatch(getAcademicYear({ degreeId: formData.degree }));
      dispatch(getSubjects(formData.degree));
    }
  }, [formData.degree]);

  // If the state gets changed then again load the institutes from state

  useEffect(() => {
    setInstitutes(preInstitutes);
  }, [preInstitutes]);

  useEffect(() => {
    setAcademicYears(preAcademicYear);
  }, [preAcademicYear]);

  return (
    <div className="row py-3">
      <SideNavbar />
      <div className="col-md-3">
        <div className="card shadow">
          <div className="card-body">
            <div class="form-group">
              <div class="col-sm-10 row">
                <div class="col-sm">
                  <label for="instituteName" class="control-label">
                    Select Institute
                  </label>
                  <select
                    className="form-control form-select"
                    onChange={(e) => {
                      let temp = institutes.find((inst) => {
                        if (inst._id === e.target.value) {
                          return inst.degrees;
                        }
                      });
                      setDegrees(temp.degrees);
                    }}
                  >
                    <option disabled={degrees ? true : false}>
                      Select the degrees
                    </option>
                    {institutes &&
                      institutes.map((inst, id) => {
                        return (
                          <option key={id} value={inst._id}>
                            {inst.instituteName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div class="col-sm-10 row">
                <div class="col-sm">
                  <label for="instituteName" class="control-label">
                    Select Degree
                  </label>
                  <select
                    className="form-control form-select"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        degree: e.target.value,
                      });
                      dispatch(getAcademicYear({ degreeId: formData.degree }));
                    }}
                    disabled={degrees ? false : true}
                  >
                    <option disabled={formData.degree ? true : false}>
                      Select an degree
                    </option>
                    {degrees &&
                      degrees.map((deg, id) => {
                        return (
                          <option key={id} value={deg._id}>
                            {deg.degreeName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div class="col-sm">
                <label for="degreeName" class="control-label">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="degreeName"
                  class="form-control"
                  value={academicYear}
                  disabled={degrees && formData.degree ? false : true}
                  onChange={(e) => {
                    setAcademicYear(e.target.value);
                  }}
                ></input>
              </div>

              <div className="p-3">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    if (academicYears.find((e) => e.year === formData.year)) {
                      dispatch(
                        setAlert("Academic Year already exists", "danger")
                      );
                    }
                    dispatch(addAcademicYear(academicYear, formData.degree));
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Academic Year</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {academicYears ? (
                  academicYears.map((ay) => {
                    return (
                      <tr>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              setFormData({
                                ...formData,
                                year: ay.year,
                              });
                              setOldAY([]);
                              academicYears.forEach((ay) => {
                                if (
                                  ay.year === formData.year &&
                                  ay.degreeId === formData.degree
                                ) {
                                  ay.semesters.forEach((a) => {
                                    setOldAY([a]);
                                  });
                                }
                              });
                            }}
                          >
                            {ay.year}
                          </button>
                        </td>
                        <td>
                          <span
                            className="fa fa-edit text-info"
                            data-toggle="modal"
                            data-target="#editInstitute"
                            onClick={(e) =>
                              setEditAY({
                                id: ay._id,
                                year: ay.year,
                              })
                            }
                          ></span>
                        </td>
                        <td>
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              dispatch(deleteAY(ay._id));
                              dispatch(getAcademicYear(formData.degree));
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <h1>no data</h1>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <div class="form-group">
              <div class="col-sm-10 row">
                <div class="col-sm-6">
                  <label for="instituteName" class="control-label">
                    Year
                  </label>
                  <h4>
                    <span class="badge badge-secondary">{formData.year}</span>
                  </h4>
                </div>
              </div>
              <div class="col-sm-10 row">
                <div class="col-sm-6">
                  <label for="instituteName" class="control-label">
                    Semester Number
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    class="form-control"
                    disabled={formData.year ? false : true}
                    value={semsub.sem}
                    onChange={(e) => {
                      setSemSub({
                        ...semsub,
                        sem: e.target.value,
                      });
                    }}
                  ></input>
                </div>
                <div class="col-sm-6">
                  <label for="degreeName" class="control-label">
                    Subject
                  </label>
                  <select
                    className="form-control form-select"
                    onChange={(e) => {
                      setSemSub({
                        ...semsub,
                        sub: e.target.value,
                      });
                      // dispatch(getAcademicYear(formData.degree));
                    }}
                    disabled={semsub.sem === 0 ? true : false}
                  >
                    <option disabled={semsub.sub ? true : false}>
                      Select an subject
                    </option>
                    {subjects &&
                      subjects.map((sub, id) => {
                        return (
                          <option key={id} value={sub._id}>
                            {sub.subjectName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="p-3">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    setSubject([...subject, semsub.sub]);
                    setFormData({
                      ...formData,
                      semesterNo: Number(semsub.sem),
                      subjects: subject,
                    });
                    dispatch(addSemesters(formData));
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Semester</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {/* {academicYears ? (
                  academicYears.map((ay) => {
                    ay.semesters.map((aa) => {
                      console.log(aa);
                      return (
                        <tr key={aa._id}>
                          <td>{aa.semesterNo}</td>
                        </tr>
                      );
                    });
                  })
                ) : (
                  <h1>No</h1>
                )} */}
                {oldAY ? (
                  oldAY.map((ay) => {
                    return (
                      <tr>
                        <td>{ay.semesterNo}</td>
                        <td>
                          <table>
                            {ay.subjects.map((t) => {
                              return (
                                <tr>
                                  <td>
                                    {t.subjectId.subjectName}-
                                    {t.subjectId.subjectCode}
                                  </td>
                                  <td>
                                    <span
                                      className="fa fa-trash-alt text-danger"
                                      onClick={(e) => {
                                        // dispatch(deleteInstitute(inst.id));
                                      }}
                                    ></span>
                                  </td>
                                </tr>
                              );
                            })}
                          </table>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <h1>No Data</h1>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Edit academic year Dialog */}
      <div
        class="modal fade"
        id="editInstitute"
        tabindex="-1"
        role="dialog"
        aria-labelledby="editInstituteLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editInstituteLabel">
                Edit Academic Year
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label class="col-form-label">Academic Year</label>
              <input
                type="text"
                class="form-control"
                value={editAY.year}
                onChange={(e) =>
                  setEditAY({
                    ...editAY,
                    year: e.target.value,
                  })
                }
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={(e) => {
                  dispatch(updateAcademicYear(editAY.year, editAY.id));
                  dispatch(getAcademicYear(formData.degree));
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of edit academic year */}
    </div>
  );
}

export default AcademicYear;
