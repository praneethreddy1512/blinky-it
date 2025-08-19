import { configureStore } from '@reduxjs/toolkit'
import useReducer from './userslice'
import productReducer from'./productSlice'

export const store = configureStore({
  reducer: {
    user : useReducer,
    product : productReducer,
  },
})