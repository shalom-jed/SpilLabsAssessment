import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/salesSlice';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, status, error } = useSelector((state) => state.sales);

    // Always re-fetch orders whenever Home mounts or status resets to idle
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleAddNew = () => navigate('/order');

    const handleEdit = (orderId) => navigate(`/order/${orderId}`);

    const handleRowDoubleClick = (orderId) => navigate(`/order/${orderId}`);

    return (
        <div className="p-6 min-h-screen flex flex-col">

            {/* ── Header ── */}
            <div className="flex items-center mb-4 pb-2 border-b-2 border-gray-800">
                <button
                    id="btn-add-new"
                    onClick={handleAddNew}
                    className="px-6 py-1 border-2 border-black font-semibold bg-gray-200 hover:bg-gray-300 rounded-sm shadow-sm transition-colors"
                >
                    Add New
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-24">Home</h1>
            </div>

            {/* ── Data Grid ── */}
            <div className="flex-1 border-2 border-gray-800 bg-white overflow-auto shadow-inner">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-300 border-b-2 border-gray-800 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Order ID</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Invoice No.</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Customer Name</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Date</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800">▼ Reference No.</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800 text-right">▼ Total Excl</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800 text-right">▼ Total Tax</th>
                            <th className="px-4 py-2 border-r border-gray-400 font-semibold text-gray-800 text-right">▼ Total Incl</th>
                            <th className="px-4 py-2 font-semibold text-gray-800 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === 'loading' && (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-gray-500 font-medium">
                                    Loading orders...
                                </td>
                            </tr>
                        )}
                        {status === 'failed' && (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-red-600 font-medium">
                                    Error loading data: {error}
                                </td>
                            </tr>
                        )}
                        {status === 'succeeded' && orders.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-gray-500">
                                    No orders found. Click <strong>Add New</strong> to create one.
                                </td>
                            </tr>
                        )}
                        {status === 'succeeded' && orders.map((order, index) => (
                            <tr
                                key={order.salesOrderId}
                                onDoubleClick={() => handleRowDoubleClick(order.salesOrderId)}
                                className={`cursor-pointer hover:bg-blue-100 transition-colors border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                title="Double-click to edit"
                            >
                                <td className="px-4 py-2 border-r border-gray-200">{order.salesOrderId}</td>
                                <td className="px-4 py-2 border-r border-gray-200">{order.invoiceNo || '—'}</td>
                                <td className="px-4 py-2 border-r border-gray-200">{order.customerName}</td>
                                <td className="px-4 py-2 border-r border-gray-200">
                                    {order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-4 py-2 border-r border-gray-200">{order.referenceNo || '—'}</td>
                                <td className="px-4 py-2 border-r border-gray-200 text-right">{Number(order.totalExcl).toFixed(2)}</td>
                                <td className="px-4 py-2 border-r border-gray-200 text-right">{Number(order.totalTax).toFixed(2)}</td>
                                <td className="px-4 py-2 border-r border-gray-200 text-right font-semibold">{Number(order.totalIncl).toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        id={`btn-edit-${order.salesOrderId}`}
                                        onClick={(e) => { e.stopPropagation(); handleEdit(order.salesOrderId); }}
                                        className="px-3 py-0.5 text-xs border border-gray-600 bg-gray-200 hover:bg-gray-300 rounded transition-colors font-semibold"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Footer ── */}
            <div className="mt-2 text-xs text-gray-500 text-right">
                {status === 'succeeded' && `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
            </div>
        </div>
    );
};

export default Home;