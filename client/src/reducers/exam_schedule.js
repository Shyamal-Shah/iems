import { EXAM_SCHEDULE_ERROR, EXAM_SCHEDULE_LOADED } from '../actions/types';

const initialState = {
  examSchedule: null,
};

const ExamSchedule = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case EXAM_SCHEDULE_LOADED:
      return {
        examSchedule: payload,
      };
    case EXAM_SCHEDULE_ERROR:
      return {
        examSchedule: null,
      };
    default:
      return state;
  }
};

export default ExamSchedule;
