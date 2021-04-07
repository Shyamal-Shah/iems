import {
  EXAM_SCHEDULES_LOADED,
  EXAM_SCHEDULE_ERROR,
  EXAM_SCHEDULE_LOADED,
} from '../actions/types';

const initialState = {
  examSchedule: null,
  examSchedules: [],
};

const ExamSchedule = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case EXAM_SCHEDULE_LOADED:
      return {
        examSchedule: payload,
        examSchedules: [],
      };
    case EXAM_SCHEDULES_LOADED:
      return {
        examSchedule: null,
        examSchedules: payload,
      };
    case EXAM_SCHEDULE_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default ExamSchedule;
