import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    fetchClients,
    fetchItems,
    fetchOrderById,
    saveOrder,
    updateOrder,
    clearCurrentOrder,
} from '../redux/slices/salesSlice';

// ─── Print Styles (injected once) ────────────────────────────────────────────
const PRINT_STYLES = `
@media print {
    body * { visibility: hidden !important; }
    #print-area, #print-area * { visibility: visible !important; }
    #print-area {
        position: fixed !important;
        inset: 0;
        padding: 24px;
        background: white;
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #000;
    }
    .no-print { display: none !important; }
}
`;

const SalesOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { clients, items, currentOrder } = useSelector((state) => state.sales);

    // Inject print styles once
    useEffect(() => {
        if (!document.getElementById('sales-print-style')) {
            const style = document.createElement('style');
            style.id = 'sales-print-style';
            style.textContent = PRINT_STYLES;
            document.head.appendChild(style);
        }
    }, []);

    // ─── State ────────────────────────────────────────────────────────────────
    const emptyHeader = {
        salesOrderId: 0,
        clientId: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        note: '',
    };

    const emptyLine = () => ({
        id: Date.now() + Math.random(),
        salesOrderLineId: 0,
        itemId: '',
        itemCode: '',
        description: '',
        note: '',
        quantity: 1,
        price: 0,
        taxRate: 0,
        exclAmount: 0,
        taxAmount: 0,
        inclAmount: 0,
    });

    const [header, setHeader] = useState(emptyHeader);
    const [selectedClient, setSelectedClient] = useState(null);
    const [lines, setLines] = useState([emptyLine()]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // ─── Initialization ───────────────────────────────────────────────────────
    useEffect(() => {
        if (clients.length === 0) dispatch(fetchClients());
        if (items.length === 0) dispatch(fetchItems());
    }, [dispatch, clients.length, items.length]);

    // Edit mode: load the existing order
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            dispatch(fetchOrderById(id));
        }
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch, id, isEditMode]);

    // Populate form when currentOrder arrives
    useEffect(() => {
        if (!isEditMode || !currentOrder) return;

        setHeader({
            salesOrderId: currentOrder.salesOrderId,
            clientId: String(currentOrder.clientId),
            invoiceNo: currentOrder.invoiceNo || '',
            invoiceDate: currentOrder.invoiceDate
                ? currentOrder.invoiceDate.split('T')[0]
                : new Date().toISOString().split('T')[0],
            referenceNo: currentOrder.referenceNo || '',
            note: currentOrder.note || '',
        });

        // Find and set the selected client for address auto-fill
        const client = clients.find(c => c.clientId === currentOrder.clientId);
        setSelectedClient(client || null);

        // Populate order lines
        const loadedLines = (currentOrder.salesOrderLines || []).map(l => ({
            id: l.salesOrderLineId,
            salesOrderLineId: l.salesOrderLineId,
            itemId: String(l.itemId),
            itemCode: l.itemCode || '',
            description: l.description || '',
            note: l.note || '',
            quantity: l.quantity,
            price: l.price,
            taxRate: l.taxRate,
            exclAmount: l.exclAmount,
            taxAmount: l.taxAmount,
            inclAmount: l.inclAmount,
        }));
        setLines(loadedLines.length > 0 ? loadedLines : [emptyLine()]);
        setIsLoading(false);
    }, [currentOrder, clients, isEditMode]);

    // If clients arrive after currentOrder, re-find selected client
    useEffect(() => {
        if (isEditMode && currentOrder && clients.length > 0 && !selectedClient) {
            const client = clients.find(c => c.clientId === currentOrder.clientId);
            if (client) setSelectedClient(client);
        }
    }, [clients, currentOrder, isEditMode, selectedClient]);

    // ─── Header Handlers ──────────────────────────────────────────────────────
    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeader(prev => ({ ...prev, [name]: value }));

        if (name === 'clientId') {
            const client = clients.find(c => c.clientId === parseInt(value));
            setSelectedClient(client || null);
        }
    };

    // ─── Line Handlers ────────────────────────────────────────────────────────
    const recalcLine = (row) => {
        const qty     = parseFloat(row.quantity) || 0;
        const prc     = parseFloat(row.price)    || 0;
        const taxRate = parseFloat(row.taxRate)  || 0;
        row.exclAmount = qty * prc;
        row.taxAmount  = row.exclAmount * (taxRate / 100);
        row.inclAmount = row.exclAmount + row.taxAmount;
        return row;
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...lines];
        let row = { ...newLines[index] };

        if (field === 'itemId') {
            // Selecting by Item Code dropdown
            const item = items.find(i => i.itemId === parseInt(value));
            row.itemId      = value;
            row.itemCode    = item ? item.itemCode    : '';
            row.description = item ? item.description : '';
            row.price       = item ? item.price       : 0;
        } else if (field === 'description') {
            // Selecting by Description dropdown (syncs item code + price)
            const item = items.find(i => i.description === value);
            if (item) {
                row.itemId      = String(item.itemId);
                row.itemCode    = item.itemCode;
                row.description = item.description;
                row.price       = item.price;
            } else {
                row.description = value;
            }
        } else {
            row[field] = value;
        }

        newLines[index] = recalcLine(row);
        setLines(newLines);
    };

    const addLine = () => setLines(prev => [...prev, emptyLine()]);

    const removeLine = (index) => {
        if (lines.length === 1) return; // keep at least 1 row
        setLines(prev => prev.filter((_, i) => i !== index));
    };

    // ─── Grand Totals ─────────────────────────────────────────────────────────
    const totals = useMemo(() =>
        lines.reduce((acc, row) => ({
            excl: acc.excl + (row.exclAmount || 0),
            tax:  acc.tax  + (row.taxAmount  || 0),
            incl: acc.incl + (row.inclAmount || 0),
        }), { excl: 0, tax: 0, incl: 0 }),
    [lines]);

    // ─── Save / Update ────────────────────────────────────────────────────────
    const handleSaveOrder = async () => {
        if (!header.clientId) {
            alert('Please select a customer.');
            return;
        }
        setIsSaving(true);

        const payload = {
            salesOrderId: header.salesOrderId,
            clientId:     parseInt(header.clientId),
            invoiceNo:    header.invoiceNo,
            invoiceDate:  header.invoiceDate,
            referenceNo:  header.referenceNo,
            note:         header.note,
            totalExcl:    totals.excl,
            totalTax:     totals.tax,
            totalIncl:    totals.incl,
            salesOrderLines: lines
                .filter(l => l.itemId)
                .map(l => ({
                    salesOrderLineId: l.salesOrderLineId || 0,
                    salesOrderId:     header.salesOrderId || 0,
                    itemId:           parseInt(l.itemId),
                    note:             l.note,
                    quantity:         parseInt(l.quantity),
                    price:            parseFloat(l.price),
                    taxRate:          parseFloat(l.taxRate),
                    exclAmount:       l.exclAmount,
                    taxAmount:        l.taxAmount,
                    inclAmount:       l.inclAmount,
                })),
        };

        try {
            if (isEditMode) {
                await dispatch(updateOrder(payload)).unwrap();
            } else {
                await dispatch(saveOrder(payload)).unwrap();
            }
            navigate('/');
        } catch (err) {
            alert('Failed to save order. Please check the console for details.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // ─── Print ────────────────────────────────────────────────────────────────
    const handlePrint = () => window.print();

    // ─── UI Helpers ───────────────────────────────────────────────────────────
    const addressFields = [
        { key: 'address1', label: 'Address 1' },
        { key: 'address2', label: 'Address 2' },
        { key: 'address3', label: 'Address 3' },
        { key: 'suburb',   label: 'Suburb'    },
        { key: 'state',    label: 'State'     },
        { key: 'postCode', label: 'Post Code' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 font-medium">Loading order...</p>
            </div>
        );
    }

    return (
        <div id="print-area" className="p-4 min-h-screen flex flex-col bg-gray-100 text-sm">

            {/* ── Top Bar ── */}
            <div className="no-print flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-800">
                <div className="flex gap-2">
                    <button
                        id="btn-save-order"
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-1 border-2 border-black font-bold bg-gray-200 hover:bg-gray-300 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                    >
                        <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">✓</span>
                        {isSaving ? 'Saving...' : 'Save Order'}
                    </button>

                    <button
                        id="btn-print-order"
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-1 border-2 border-gray-700 font-bold bg-white hover:bg-gray-100 rounded-sm shadow-sm transition-colors"
                    >
                        🖨️ Print
                    </button>

                    <button
                        id="btn-back-home"
                        onClick={() => navigate('/')}
                        className="px-4 py-1 border-2 border-gray-600 bg-gray-200 hover:bg-gray-300 rounded-sm transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                <h1 className="font-bold text-base mr-[50%] translate-x-[50%]">
                    {isEditMode ? `Sales Order (Edit #${id})` : 'Sales Order'}
                </h1>
            </div>

            {/* Print-only header */}
            <div className="hidden print:block mb-4 text-center">
                <h1 className="text-2xl font-bold">Sales Order</h1>
                {isEditMode && <p className="text-gray-600">Order #{id}</p>}
            </div>

            {/* ── Header Form ── */}
            <div className="grid grid-cols-2 gap-8 mb-4">

                {/* Left – Customer & Address */}
                <div className="space-y-1">
                    <div className="flex items-center">
                        <label className="w-28 text-gray-800 font-medium shrink-0">Customer Name</label>
                        <select
                            id="select-customer"
                            name="clientId"
                            value={header.clientId}
                            onChange={handleHeaderChange}
                            className="flex-1 border-2 border-gray-800 p-1 bg-white"
                        >
                            <option value="">Select Customer...</option>
                            {clients.map(c => (
                                <option key={c.clientId} value={c.clientId}>{c.customerName}</option>
                            ))}
                        </select>
                    </div>

                    {addressFields.map(({ key, label }) => (
                        <div className="flex items-center" key={key}>
                            <label className="w-28 text-gray-700 shrink-0">{label}</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedClient ? (selectedClient[key] || '') : ''}
                                className="flex-1 border border-gray-400 p-1 bg-gray-200 text-gray-600"
                            />
                        </div>
                    ))}
                </div>

                {/* Right – Invoice Details */}
                <div className="space-y-1">
                    <div className="flex items-center">
                        <label className="w-28 text-gray-800 shrink-0">Invoice No.</label>
                        <input id="input-invoice-no" name="invoiceNo" value={header.invoiceNo} onChange={handleHeaderChange} type="text" className="flex-1 border-2 border-gray-800 p-1" />
                    </div>
                    <div className="flex items-center">
                        <label className="w-28 text-gray-800 shrink-0">Invoice Date</label>
                        <input id="input-invoice-date" name="invoiceDate" value={header.invoiceDate} onChange={handleHeaderChange} type="date" className="flex-1 border-2 border-gray-800 p-1" />
                    </div>
                    <div className="flex items-center">
                        <label className="w-28 text-gray-800 shrink-0">Reference No.</label>
                        <input id="input-reference-no" name="referenceNo" value={header.referenceNo} onChange={handleHeaderChange} type="text" className="flex-1 border-2 border-gray-800 p-1" />
                    </div>
                    <div className="flex items-start mt-1">
                        <label className="w-28 text-gray-800 shrink-0 pt-1">Note</label>
                        <textarea id="input-note" name="note" value={header.note} onChange={handleHeaderChange} rows={4} className="flex-1 border-2 border-gray-800 p-1 resize-none" />
                    </div>
                </div>
            </div>

            {/* ── Items Grid ── */}
            <div className="border-2 border-gray-800 bg-white overflow-x-auto mb-3 shadow-inner">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-300 border-b-2 border-gray-800">
                        <tr>
                            <th className="px-2 py-1 border-r border-gray-400 w-6 no-print"></th>
                            <th className="px-2 py-1 border-r border-gray-400 w-36">Item Code</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-48">Description</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-28">Note</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-16">Quantity</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-20">Price</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-16">Tax %</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-24 text-right">Excl Amount</th>
                            <th className="px-2 py-1 border-r border-gray-400 w-24 text-right">Tax Amount</th>
                            <th className="px-2 py-1 w-24 text-right">Incl Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((line, index) => (
                            <tr key={line.id} className="border-b border-gray-200 hover:bg-blue-50">
                                {/* Remove button */}
                                <td className="px-1 py-1 border-r border-gray-200 text-center no-print">
                                    <button
                                        onClick={() => removeLine(index)}
                                        className="text-red-500 font-bold hover:text-red-700 leading-none"
                                        title="Remove line"
                                    >×</button>
                                </td>
                                {/* Item Code dropdown */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <select
                                        value={line.itemId}
                                        onChange={(e) => handleLineChange(index, 'itemId', e.target.value)}
                                        className="w-full border border-gray-300 p-0.5 bg-white"
                                    >
                                        <option value="">Select...</option>
                                        {items.map(i => (
                                            <option key={i.itemId} value={i.itemId}>{i.itemCode}</option>
                                        ))}
                                    </select>
                                </td>
                                {/* Description dropdown */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <select
                                        value={line.description}
                                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                        className="w-full border border-gray-300 p-0.5 bg-white"
                                    >
                                        <option value="">Select...</option>
                                        {items.map(i => (
                                            <option key={i.itemId} value={i.description}>{i.description}</option>
                                        ))}
                                    </select>
                                </td>
                                {/* Note */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <input type="text" value={line.note} onChange={(e) => handleLineChange(index, 'note', e.target.value)} className="w-full border border-gray-300 p-0.5" />
                                </td>
                                {/* Quantity */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <input type="number" min="1" value={line.quantity} onChange={(e) => handleLineChange(index, 'quantity', e.target.value)} className="w-full border border-gray-300 p-0.5 text-right" />
                                </td>
                                {/* Price */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <input type="number" min="0" step="0.01" value={line.price} onChange={(e) => handleLineChange(index, 'price', e.target.value)} className="w-full border border-gray-300 p-0.5 text-right" />
                                </td>
                                {/* Tax Rate */}
                                <td className="px-1 py-1 border-r border-gray-200">
                                    <input type="number" min="0" step="0.01" value={line.taxRate} onChange={(e) => handleLineChange(index, 'taxRate', e.target.value)} className="w-full border border-gray-300 p-0.5 text-right" />
                                </td>
                                {/* Calculated (read-only) */}
                                <td className="px-2 py-1 border-r border-gray-200 text-right bg-gray-50">{line.exclAmount.toFixed(2)}</td>
                                <td className="px-2 py-1 border-r border-gray-200 text-right bg-gray-50">{line.taxAmount.toFixed(2)}</td>
                                <td className="px-2 py-1 text-right bg-gray-50 font-medium">{line.inclAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    id="btn-add-line"
                    onClick={addLine}
                    className="no-print m-2 px-3 py-1 bg-gray-200 border border-gray-600 text-xs font-bold hover:bg-gray-300"
                >
                    + Add Item
                </button>
            </div>

            {/* ── Grand Totals ── */}
            <div className="flex justify-end pr-1">
                <div className="w-72 space-y-1">
                    {[
                        { label: 'Total Excl', value: totals.excl, bold: false },
                        { label: 'Total Tax',  value: totals.tax,  bold: false },
                        { label: 'Total Incl', value: totals.incl, bold: true  },
                    ].map(({ label, value, bold }) => (
                        <div key={label} className="flex items-center justify-between">
                            <span className={`text-gray-800 ${bold ? 'font-bold' : 'font-semibold'}`}>{label}</span>
                            <div className={`border-2 ${bold ? 'border-black font-bold' : 'border-gray-700'} w-36 px-2 py-1 text-right bg-white`}>
                                {value.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesOrder;