import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneNumber: "",
  postCode: "",
  addresses: [],
  selectedAddress: null,
  products: [],
  selectedProductDetails: null,
  appointmentDetails: null,
  addressType: null,
  selectedAppointment: null,
  cpwnRef: "",
  serviceId: "",
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setPostCode: (state, action) => {
      state.postCode = action.payload;
    },
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProductDetails: (state, action) => {
      state.selectedProductDetails = action.payload;
    },
    setAppointmentDetails: (state, action) => {
      state.appointmentDetails = action.payload;
    },
    setAddressType: (state, action) => {
      state.addressType = action.payload;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    setCpwnRef: (state, action) => {
      state.cpwnRef = action.payload;
    },
    setServiceId: (state, action) => {
      state.serviceId = action.payload;
    },
  },
});

export const {
  setPhoneNumber,
  setSelectedAddress,
  setPostCode,
  setAddresses,
  setProducts,
  setSelectedProductDetails,
  setAppointmentDetails,
  setAddressType,
  setSelectedAppointment,
  setCpwnRef,
  setServiceId,
} = addressSlice.actions;
export default addressSlice.reducer;
