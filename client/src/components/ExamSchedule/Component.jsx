import React, { Fragment } from "react";

const Component = ({
  newSubject = true,
  subjectName,
  datetime,
  onFromDateChange,
  onToDateChange,
  onSubjectNameChange,
  examFrom,
  examTo,
  index,
}) => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <label>Subject Code and Name:</label>
            {!newSubject && <p className="h4 m-1">{subjectName}</p>}
            {newSubject && (
              <input
                id={index + "-subjectName"}
                className="form-control"
                placeholder="New Subject Code and Name"
                // pattern="^([A-Z][A-Z][-][0-9]+)_([a-zA-Z ]+)$"
                title="Example: CE-123_SubjectName"
                required
                value={subjectName}
                onChange={(e) => {
                  onSubjectNameChange(e);
                }}
              />
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="form-group">
            <label>From:</label>
            <input
              id={index + "-from"}
              type="datetime-local"
              className="form-control"
              value={datetime}
              min={examFrom}
              max={examTo}
              onChange={(e) => {
                onFromDateChange(e);
              }}
              required
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="form-group">
            <label>To:</label>
            <input
              id={index + "-to"}
              type="datetime-local"
              className="form-control"
              value={datetime}
              min={examFrom}
              max={examTo}
              onChange={(e) => {
                onToDateChange(e);
              }}
              required
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Component;
