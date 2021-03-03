import { combineReducers } from "redux";
import Alert from "./alert";
import Auth from "./auth";
import InstituteDegree from "./institute_degree";
import AcademicYear from "./academic_year";

export default combineReducers({ Alert, Auth, InstituteDegree, AcademicYear });
