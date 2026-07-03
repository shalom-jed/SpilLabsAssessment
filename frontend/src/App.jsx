import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<SalesOrder />} />
        <Route path="/order/:id" element={<SalesOrder />} />
      </Routes>
    </div>
  );
}

export default App;