import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks for API Calls
export const fetchClients = createAsyncThunk('sales/fetchClients', async () => {
    const response = await api.get('/clients');
    return response.data;
});

export const fetchItems = createAsyncThunk('sales/fetchItems', async () => {
    const response = await api.get('/items');
    return response.data;
});

export const fetchOrders = createAsyncThunk('sales/fetchOrders', async () => {
    const response = await api.get('/salesorders');
    return response.data;
});

export const saveOrder = createAsyncThunk('sales/saveOrder', async (orderData) => {
    const response = await api.post('/salesorders', orderData);
    return response.data;
});

const salesSlice = createSlice({
    name: 'sales',
    initialState: {
        clients: [],
        items: [],
        orders: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Clients
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.clients = action.payload;
            })
            // Items
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Save Order
            .addCase(saveOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload); // Add new order to the top of the list
            });
    },
});

export default salesSlice.reducer;