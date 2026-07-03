import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

function App() {
  return (
    <div className="min-h-screen bg-gray-400 p-4 md:p-8 flex items-center justify-center font-sans">
      {/* Outer Application Window Wrapper */}
      <div className="w-full max-w-6xl h-[800px] bg-gray-200 border-2 border-gray-800 shadow-2xl rounded-t-md overflow-hidden flex flex-col">
        
        {/* Fake OS Window Title Bar */}
        <div className="bg-gray-300 border-b-2 border-gray-800 px-3 py-1 flex items-center gap-2">
           <div className="w-3 h-3 rounded-full border border-gray-800 bg-white"></div>
           <div className="w-3 h-3 rounded-full border border-gray-800 bg-white"></div>
           <div className="w-3 h-3 rounded-full border border-gray-800 bg-white"></div>
        </div>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<SalesOrder />} />
            
            {/* The :id parameter allows us to load specific orders for editing */}
            <Route path="/order/:id" element={<SalesOrder />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;