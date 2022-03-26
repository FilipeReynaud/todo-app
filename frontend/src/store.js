import { configureStore } from "@reduxjs/toolkit";
import globalSliceReducer from "./globalSlice";

export const store = configureStore({
	reducer: { app: globalSliceReducer },
});
