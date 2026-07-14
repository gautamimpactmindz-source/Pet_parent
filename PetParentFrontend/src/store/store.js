import {configureStore} from '@reduxjs/toolkit';
import { baseApi } from '../apis/baseApi';
import authreducer from './slices/authSlice';

export const store = configureStore({
    reducer:{
        auth:authreducer,
        [baseApi.reducerPath]:baseApi.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(baseApi.middleware)
})