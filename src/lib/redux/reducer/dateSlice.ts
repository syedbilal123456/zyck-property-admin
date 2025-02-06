import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

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
  provinces: Province[];
  provinceCounts: { [key: string]: number };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface Province {
  id: number;
  stateId: number;
}

const provinceNames: { [key: number]: string } = {
  1: "Sindh",
  2: "Punjab", 
  3: "Balochistan", 
  4: "KPK", 
  5: "Gilgit-Baltistan"
};

export const fetchProvinceData = createAsyncThunk(
  'date/fetchProvinceData',
  async ({ month, year }: { month: number; year: number }) => {
    const response = await fetch(`/api/provinces?month=${month}&year=${year}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch provinces');
    }

    const result = await response.json();
    
    const provinceCounts = result.province.reduce((acc: { [key: string]: number }, item: Province) => {
      const provinceName = provinceNames[item.stateId] || `Unknown (${item.stateId})`;
      acc[provinceName] = (acc[provinceName] || 0) + 1;
      return acc;
    }, {});

    return { provinces: result.province, provinceCounts };
  }
);

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
  provinces: [],
  provinceCounts: {},
  status: 'idle',
  error: null
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDates: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      const { startDate, endDate } = action.payload;

      state.startDate = startDate;
      state.endDate = endDate;

      const start = new Date(startDate);
      state.startDay = start.getDate();
      state.startWeek = Math.ceil(start.getDate() / 7);
      state.startMonth = start.getMonth() + 1;
      state.startYear = start.getFullYear();

      const end = new Date(endDate);
      state.endDay = end.getDate();
      state.endWeek = Math.ceil(end.getDate() / 7);
      state.endMonth = end.getMonth() + 1;
      state.endYear = end.getFullYear();
    },
    resetDates: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProvinceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provinces = action.payload.provinces;
        state.provinceCounts = action.payload.provinceCounts;
      })
      .addCase(fetchProvinceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  }
});

export const { setDates, resetDates } = dateSlice.actions;

export default dateSlice;