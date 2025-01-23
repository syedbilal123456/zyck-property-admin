import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface DateState {
    startDate: any;
    endDate: any;
}


// Initialize state with values from localStorage or default to an empty string
const initialState: DateState = {
    startDate: localStorage.getItem('startDate') || '',
    endDate: localStorage.getItem('endDate') || '',
};

export const propertySlice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setStartDate: (state, action : PayloadAction<any> ) => {
            state.startDate = action.payload;
            localStorage.setItem('startDate', action.payload); // Sync to localStorage
        },
        setEndDate: (state, action : PayloadAction<any>) => {
            state.endDate = action.payload;
            localStorage.setItem('endDate', action.payload); // Sync to localStorage
        },
        removeDate: (state) => {
            state.endDate = ""; // Clear the Redux state
            localStorage.removeItem('endDate'); // Remove from localStorage
        }
    }
});

export const { setStartDate, setEndDate, removeDate } = propertySlice.actions;

export default propertySlice.reducer;
