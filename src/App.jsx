import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './components/AllPages/Home/HomePage';
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
import BookCategory from './components/AllPages/BooksCategory/BookCategory';


// Layout component that includes the Header
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Routes with Header */}
          <Route path='/' element={
            <Layout>
              <HomePage />
            </Layout>
          } />

          {/* Dynamic Category Route - This should match /collections/anything */}

          {/* Categories Listing Page */}
          <Route path='/categories' element={
            <Layout>
              <Category />
            </Layout>
          } />

          <Route path='/collections/:category' element={
            <Layout>
              <BookCategory />
            </Layout>
          } />

          {/* Book Detailed Page */}
          <Route path='/products/:id' element={
            <Layout>
              <SingleBookPage />
            </Layout>
          } />

          {/* Cart page routes */}
          <Route path='/viewcart' element={
            <Layout>
              <Cart />
            </Layout>
          } />
          <Route path='/additional-details' element={
            <Layout>
              <CartAddressDetails />
            </Layout>
          } />

          {/* Admin Routes */}
          <Route path="/admin/books/publish" element={<PublishBooks />} />
          <Route path="/admin/books/update-book/:id" element={<UpdateBooks />} />

          {/* User authentication routes */}
          <Route path='/login' element={
            <Layout>
              <Login />
            </Layout>
          } />
          <Route path='/sign-up' element={
            <Layout>
              <SignUp />
            </Layout>
          } />

          {/* Support Pages */}
          <Route path='/privacy-policy' element={
            <Layout>
              <Policy />
            </Layout>
          } />
          <Route path='/contact-us' element={
            <Layout>
              <Contacts />
            </Layout>
          } />

          {/* Search */}
          <Route path="/search" element={
            <Layout>
              <SearchResults />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App