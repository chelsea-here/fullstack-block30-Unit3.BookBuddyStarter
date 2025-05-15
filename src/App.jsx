import { useState } from "react"
import {Routes, Route } from "react-router-dom"
// import LogoImage from "./assets/owl-babelplatz.svg"

import Home from "./components/Home"
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
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route path="/books" element={<Books api={api} allBooks={allBooks}/>}/>
      <Route path="/books/:id" element={<SingleBook allBooks={allBooks} />}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/account" element={<Account />}/>
    </Routes>
    </>
  )
}

export default App
