import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./addressSlice";
import customerReducer from "./customerSlice";

export const store = configureStore({
    reducer: {
        address : addressReducer,
        customer : customerReducer,
    },
});

export default store;