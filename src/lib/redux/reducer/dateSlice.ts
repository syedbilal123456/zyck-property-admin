import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DateDetails {
  startDate: string;
  endDate: string;
  startDay: number | null;
  startWeek: number | null;
  startMonth: number | null;
  startYear: number | null;
  endDay: number | null;
  endWeek: number | null;
  endMonth: number | null;
  endYear: number | null;
}


const initialState: DateDetails = {
  startDate: "",
  endDate: "",
  startDay: null,
  startWeek: null,
  startMonth: null,
  startYear: null,
  endDay: null,
  endWeek: null,
  endMonth: null,
  endYear: null,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDates: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      const { startDate, endDate } = action.payload;

      // Set the provided startDate and endDate
      state.startDate = startDate;
      state.endDate = endDate;

      // Calculate and set additional date details for the startDate
      const start = new Date(startDate);
      state.startDay = start.getDate();
      state.startWeek = Math.ceil(start.getDate() / 7);
      state.startMonth = start.getMonth() + 1; // Month is 0-indexed
      state.startYear = start.getFullYear();

      // Calculate and set additional date details for the endDate
      const end = new Date(endDate);
      state.endDay = end.getDate();
      state.endWeek = Math.ceil(end.getDate() / 7);
      state.endMonth = end.getMonth() + 1; // Month is 0-indexed
      state.endYear = end.getFullYear();
    },
    resetDates: (state) => {
      state.startDate = "";
      state.endDate = "";
      state.startDay = null;
      state.startWeek = null;
      state.startMonth = null;
      state.startYear = null;
      state.endDay = null;
      state.endWeek = null;
      state.endMonth = null;
      state.endYear = null;
    },
  },
});

export const { setDates, resetDates } = dateSlice.actions;

export default dateSlice;
