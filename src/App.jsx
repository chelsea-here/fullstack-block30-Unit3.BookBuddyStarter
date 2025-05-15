import { useState } from "react"
import {Routes, Route } from "react-router-dom"
import LogoImage from "./assets/owl-babelplatz.svg"

import Books from "./components/Books";
import SingleBook from "./components/SingleBook"
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Navigations from "./components/Navigations";


function App() {
 // const [token, setToken] = useState(null)
 const [allBooks, setAllBooks] = useState([]);
 const api = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";


  return (
    <>
    <Navigations />
    <div>
      <h1><img src={LogoImage} id='logo-image'/>Library App</h1>

      <p>Complete the React components needed to allow users to browse a library catalog, check out books, review their account, and return books that they've finished reading.</p>

      <p>You may need to use the `token` in this top-level component in other components that need to know if a user has logged in or not.</p>

      <p>Don't forget to set up React Router to navigate between the different views of your single page application!</p>
      <hr />
    </div>
    <Routes>
      <Route path="/" element={<Books api={api} allBooks={allBooks}/>}/>
      <Route path="/books/:id" element={<SingleBook allBooks={allBooks} />}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/account" element={<Account />}/>
    </Routes>
    </>
  )
}

export default App
