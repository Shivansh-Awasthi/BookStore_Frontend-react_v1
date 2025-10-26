import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './components/AllPages/Home/HomePage';
import Science from './components/AllPages/BooksCategory/Science';
import History from './components/AllPages/BooksCategory/History';
import Fiction from './components/AllPages/BooksCategory/Fiction';
import Kids from './components/AllPages/BooksCategory/Kids';
import Biography from './components/AllPages/BooksCategory/Biography';
import SingleBookPage from './components/AllPages/SingleBook/SingleBookPage';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>


          {/* Book Categories Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/collections/science' element={<Science />} />
          <Route path='/collections/history' element={<History />} />
          <Route path='/collections/fiction' element={<Fiction />} />
          <Route path='/collections/kids' element={<Kids />} />
          <Route path='/collections/biography' element={<Biography />} />

          {/* Book Detailed Page */}
          <Route path='/products/:id' element={<SingleBookPage />} />

        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
