import React from "react";
import { Link } from "react-router-dom";

function Subject() {
  return (
    <div className="row py-3">
      {/* <div className='col-md-3'></div> */}
      <div className="col-md-3">
        <div className="card shadow">
          <div className="card-body">
            <Link className="btn btn-outline-info w-100 mb-3" to="institute">
              Institute Name
            </Link>
            <Link className="btn btn-outline-info w-100 mb-3" to="subject">
              Subject
            </Link>
            <Link className="btn btn-outline-info w-100 mb-3" to="academicYear">
              Academic Year
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-9">
        <div className="card shadow">
          <div className="card-body">
            <div class="form-group">
              <div class="col-sm-10 row">
                <div class="col-sm-6">
                  <label for="instituteName" class="control-label">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    class="form-control"
                  ></input>
                </div>
                <div class="col-sm-6">
                  <label for="degreeName" class="control-label">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    name="degreeName"
                    class="form-control"
                  ></input>
                </div>
              </div>
              <div className="p-3">
                <input type="submit" className="btn btn-primary" value="Add" />
              </div>
            </div>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Institute Name</th>
                  <th>Degree Name</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Chandubhai S. Patel Institute of Science and Technology
                  </td>
                  <td>CE</td>
                  <td>Abc</td>
                </tr>
                <tr>
                  <td>Depstar</td>
                  <td>IT</td>
                  <td>Xyz</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subject;
