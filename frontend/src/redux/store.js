import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './slices/salesSlice';

export const store = configureStore({
    reducer: {
        sales: salesReducer,
    },
});