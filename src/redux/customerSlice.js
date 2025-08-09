import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerPrimaryName: "",
  customerPrimaryNumber: "",
  customerSecondaryName: "",
  customerSecondaryNumber: "",
  ipBlockSize: "",
  author1: "",
  author2: "",
  author3: "",
  customerEmail: "",
  customerAKJ: "",
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerPrimaryName: (state, action) => {
      state.customerPrimaryName = action.payload;
    },
    setCustomerPrimaryNumber: (state, action) => {
      state.customerPrimaryNumber = action.payload;
    },
    setCustomerSecondaryName: (state, action) => {
      state.customerSecondaryName = action.payload;
    },
    setCustomerSecondaryNumber: (state, action) => {
      state.customerSecondaryNumber = action.payload;
    },
    setIpBlockSize: (state,action)  => {
      state.ipBlockSize = action.payload;
    },
    setAuthor1: (state,action) => {
      state.author1 = action.payload;
    },
    setAuthor2: (state,action) => {
      state.author2 = action.payload;
    },
    setAuthor3: (state,action) => {
      state.author3 = action.payload;
    },
    setCustomerEmail: (state, action) => {
      state.customerEmail = action.payload;
    },
    setCustomerAKJ: (state, action) => {
      state.customerAKJ = action.payload;
    },
  },
});

export const {
  setCustomerPrimaryName,
  setCustomerPrimaryNumber,
  setCustomerSecondaryName,
  setCustomerSecondaryNumber,
  setIpBlockSize,
  setAuthor1,
  setAuthor2,
  setAuthor3,
  setCustomerEmail,
  setCustomerAKJ,
} = customerSlice.actions;

export default customerSlice.reducer;
