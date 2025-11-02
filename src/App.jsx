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
          <Route path='/collections/science' element={
            <Layout>
              <Science />
            </Layout>
          } />
          <Route path='/collections/history' element={
            <Layout>
              <History />
            </Layout>
          } />
          <Route path='/collections/fiction' element={
            <Layout>
              <Fiction />
            </Layout>
          } />
          <Route path='/collections/kids' element={
            <Layout>
              <Kids />
            </Layout>
          } />
          <Route path='/collections/biography' element={
            <Layout>
              <Biography />
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

          {/* Admin Routes - You might want to exclude Header from these */}
          <Route path="/admin/books/publish" element={<PublishBooks />} />
          <Route path="admin/books/update-book/:id" element={<UpdateBooks />} />

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
          <Route path='/Privacy-policy' element={
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

          {/* Remove temporary header route since it's now included everywhere */}
          {/* <Route path='/header' element={<Header />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App