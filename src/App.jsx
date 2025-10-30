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
import Cart from './components/AllPages/CartPages/Cart';
import Login from './components/Admin/Login';
import SignUp from './components/Admin/SignUp';
import Policy from './components/OtherPages/Policy';
import Contacts from './components/OtherPages/Contact';
import CartAddressDetails from './components/AllPages/CartPages/CartAddiressDetails';
import PublishBooks from './components/Admin/BooksManagement/PublishBooks';
import UpdateBooks from './components/Admin/BooksManagement/UpdateBooks';
import Header from './components/Header/Header';
import SearchResults from './components/Header/SearchResults';
import Category from './components/AllPages/BooksCategory/Category';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>


          {/* Book Categories Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/category' element={<Category />} />
          <Route path='/collections/science' element={<Science />} />
          <Route path='/collections/history' element={<History />} />
          <Route path='/collections/fiction' element={<Fiction />} />
          <Route path='/collections/kids' element={<Kids />} />
          <Route path='/collections/biography' element={<Biography />} />


          {/* Book Detailed Page */}
          <Route path='/products/:id' element={<SingleBookPage />} />


          {/* cart page routtes */}
          <Route path='/viewcart' element={<Cart />} />
          <Route path='/additional-details' element={<CartAddressDetails />} />


          {/* Admin Routes */}
          <Route path="/admin/books/publish" element={<PublishBooks />} />
          <Route path="admin/books/update-book/:id" element={<UpdateBooks />} />


          {/* user authentication routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />


          {/* Support Pages */}
          <Route path='/Privacy-policy' element={<Policy />} />
          <Route path='/contact-us' element={<Contacts />} />


          {/* Search */}
          <Route path="/search" element={<SearchResults />} />


          {/* Temporary routes for testing purpose only */}
          <Route path='/header' element={<Header />} />


        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
