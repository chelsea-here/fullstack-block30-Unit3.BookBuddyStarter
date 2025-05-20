import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
// import LogoImage from "./assets/owl-babelplatz.svg"

import Home from "./components/Home";
import Books from "./components/Books/Books";
import SingleBook from "./components/Books/SingleBook";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Account from "./components/Auth/Account";
import Navigations from "./components/Navigations";

function App() {
  const api = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({});
  const [reserves, setReserves] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data } = await axios.get(`${api}/books`);
        // console.log(data);
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBooks();
  }, [api, books]);

  const authenticate = useCallback(
    async (token) => {
      try {
        if (!token) {
          throw Error("no token found");
        }
        const response = await axios.get(`${api}/users/me`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        setUser(response.data);
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    },
    [user]
  );

  useEffect(() => {
    const loggedInToken = window.localStorage.getItem("token");
    if (loggedInToken) {
      authenticate(loggedInToken);
    }
  }, [user.id, authenticate]);

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const { data } = await axios.get(`${api}/reservations`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });
        console.log("reserves", data);
        setReserves(data);
      } catch (error) {
        console.error(error);
      }
    };
    const loggedInToken = window.localStorage.getItem("token");
    if (loggedInToken) {
      fetchReserves();
    }
  }, [user.id]);

  return (
    <>
      <Navigations />
      <Routes>
        <Route exact path="/" element={<Home user={user} />} />
        <Route
          path="/books"
          element={
            <Books
              books={books}
              api={api}
              reserves={reserves}
              setReserves={setReserves}
              user={user}
              authenticate={authenticate}
            />
          }
        />
        <Route path="/books/:id" element={<SingleBook books={books} />} />
        <Route
          path="/login"
          element={<Login api={api} authenticate={authenticate} />}
        />
        <Route path="/register" element={<Register api={api} />} />
        <Route
          path="/account"
          element={
            <Account
              user={user}
              api={api}
              reserves={reserves}
              setReserves={setReserves}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
