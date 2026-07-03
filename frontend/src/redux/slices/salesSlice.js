import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks ────────────────────────────────────────────────────────────

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

export const fetchOrderById = createAsyncThunk('sales/fetchOrderById', async (id) => {
    const response = await api.get(`/salesorders/${id}`);
    return response.data;
});

export const saveOrder = createAsyncThunk('sales/saveOrder', async (orderData) => {
    const response = await api.post('/salesorders', orderData);
    return response.data;
});

export const updateOrder = createAsyncThunk('sales/updateOrder', async (orderData) => {
    const response = await api.put(`/salesorders/${orderData.salesOrderId}`, orderData);
    return response.data;
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const salesSlice = createSlice({
    name: 'sales',
    initialState: {
        clients: [],
        items: [],
        orders: [],
        currentOrder: null,
        status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
        saveStatus: 'idle',
        error: null,
    },
    reducers: {
        resetSaveStatus(state) {
            state.saveStatus = 'idle';
        },
        clearCurrentOrder(state) {
            state.currentOrder = null;
        },
    },
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
            // Fetch all orders
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
            // Fetch single order (for edit mode)
            .addCase(fetchOrderById.pending, (state) => {
                state.currentOrder = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            // Create order
            .addCase(saveOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload);
                state.status = 'idle'; // force re-fetch on next Home visit
            })
            // Update order
            .addCase(updateOrder.fulfilled, (state, action) => {
                const idx = state.orders.findIndex(
                    o => o.salesOrderId === action.payload.salesOrderId
                );
                if (idx !== -1) {
                    state.orders[idx] = action.payload;
                }
                state.status = 'idle'; // force re-fetch on next Home visit
            });
    },
});

export const { resetSaveStatus, clearCurrentOrder } = salesSlice.actions;
export default salesSlice.reducer;