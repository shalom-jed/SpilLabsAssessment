import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/salesSlice';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Pull state from Redux
    const { orders, status, error } = useSelector((state) => state.sales);

    // Fetch orders when the component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchOrders());
        }
    }, [status, dispatch]);

    // Navigation Handlers
    const handleAddNew = () => {
        navigate('/order');
    };

    const handleRowDoubleClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header Area */}
            <div className="flex items-center mb-4 pb-2 border-b-2 border-gray-800">
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-1 border-2 border-black font-semibold bg-gray-200 hover:bg-gray-300 rounded-sm shadow-sm transition-colors"
                >
                    Add New
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-24">Home</h1>
            </div>

            {/* Data Grid */}
            <div className="flex-1 border-2 border-gray-800 bg-white overflow-x-auto shadow-inner">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-300 border-b-2 border-gray-800">
                        <tr>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Order ID</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Invoice No.</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Customer Name</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Date</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Total Excl</th>
                            <th className="px-4 py-2 font-semibold text-gray-800">▼ Total Incl</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === 'loading' && (
                            <tr><td colSpan="6" className="text-center py-8 font-medium">Loading orders...</td></tr>
                        )}
                        {status === 'failed' && (
                            <tr><td colSpan="6" className="text-center py-8 text-red-600 font-medium">Error loading data: {error}</td></tr>
                        )}
                        {status === 'succeeded' && orders.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-8 font-medium text-gray-500">No orders found. Click 'Add New'.</td></tr>
                        )}
                        {status === 'succeeded' && orders.map((order, index) => (
                            <tr 
                                key={order.salesOrderId} 
                                onDoubleClick={() => handleRowDoubleClick(order.salesOrderId)}
                                className={`cursor-pointer hover:bg-blue-100 transition-colors border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                title="Double-click to edit"
                            >
                                <td className="px-4 py-2 border-r border-gray-300">{order.salesOrderId}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{order.invoiceNo || 'Draft'}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{order.customerName}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{new Date(order.invoiceDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{order.totalExcl.toFixed(2)}</td>
                                <td className="px-4 py-2">{order.totalIncl.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;