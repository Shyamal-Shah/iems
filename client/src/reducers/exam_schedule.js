import { EXAM_SCHEDULE_ADDED } from "../actions/types";

const initialState = {
  examSchedule: null,
};

const ExamSchedule = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case EXAM_SCHEDULE_ADDED:
      return state;
    default:
      return state;
  }
};

export default ExamSchedule;
