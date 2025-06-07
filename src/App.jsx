import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Books from "./components/Books/Books";
import SingleBook from "./components/Books/SingleBook";
import Search from "./components/Search";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Account from "./components/Auth/Account";
import Navigations from "./components/Navigations";

function App() {
  const api = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data } = await axios.get(`${api}/books`);
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBooks();
  }, [api]);

  const authenticate = useCallback(async (token) => {
    try {
      if (!token) {
        setUser({});
        throw Error("no token found");
      }
      const response = await axios.get(`${api}/users/me`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const loggedInToken = window.localStorage.getItem("token");
    if (loggedInToken) {
      authenticate(loggedInToken);
    }
  }, [user.id, authenticate]);

  const removeReservation = async (reservationId, bookId) => {
    try {
      await axios.delete(`${api}/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setUser(
        user.reservations.filter((res) => {
          res.id !== reservationId;
        })
      );
      const updatedBooks = books.map((book) => {
        if (book.id == bookId) {
          return { ...book, available: true };
        }
        return book;
      });
      setBooks(updatedBooks);
    } catch (error) {
      console.error(error);
    }
  };

  const removeResByBookId = async (bookId, user) => {
    const getRes = (bookId) => {
      return user.reservations.find((reservation) => {
        if (reservation.bookid === bookId) {
          return reservation;
        }
      });
    };
    const resId = getRes(bookId).id;
    removeReservation(resId, bookId);
  };

  const reserveBook = async (bookId) => {
    try {
      authenticate(window.localStorage.getItem("token"));
      const { data } = await axios.post(
        `${api}/reservations`,
        { bookId: bookId },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );
      setUser({
        ...user,
        reservations: [...user.reservations, data],
      });

      const updatedBooks = books.map((book) => {
        if (book.id === bookId) {
          return { ...book, available: false }; // Mark the book as reserved
        }
        return book;
      });
      setBooks(updatedBooks);
    } catch (error) {
      console.error(error);
    }
  };

  // Check if the user has a reservation for the book with the given bookId
  const checkRes = (book, user) => {
    const userReservations = user.reservations || [];
    return userReservations.find((reservation) => {
      return reservation.bookid === book.id;
    });
  };

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
              user={user}
              authenticate={authenticate}
              setBooks={setBooks}
              removeResByBookId={removeResByBookId}
              reserveBook={reserveBook}
              checkRes={checkRes}
            />
          }
        />
        <Route
          path="/books/:id"
          element={
            <SingleBook
              books={books}
              reserveBook={reserveBook}
              removeResByBookId={removeResByBookId}
              checkRes={checkRes}
              user={user}
            />
          }
        />
        <Route path="/books/search/?" element={<Search books={books} />} />
        <Route
          path="/login"
          element={<Login api={api} authenticate={authenticate} />}
        />
        <Route path="/register" element={<Register api={api} />} />
        <Route
          path="/account"
          element={
            <Account
              books={books}
              user={user}
              api={api}
              removeReservation={removeReservation}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
