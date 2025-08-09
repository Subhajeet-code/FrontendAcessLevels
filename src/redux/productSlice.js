import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedProduct: null,
    accessLineId: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setAccessLineId: (state, action) => {
            state.accessLineId = action.payload;
        },
    },
});

export const { setProducts,  setSelectedProduct, setAccessLineId } = productSlice.actions;
export default productSlice.reducer;