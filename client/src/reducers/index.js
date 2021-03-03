import { combineReducers } from 'redux';
import Alert from './alert';
import Auth from './auth';
import CurrentState from './current';
import AcademicYear from './academic_year';
import InstituteDegree from './institute_degree';

export default combineReducers({
  Alert,
  Auth,
  CurrentState,
  AcademicYear,
  InstituteDegree,
});