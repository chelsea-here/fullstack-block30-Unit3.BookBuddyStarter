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

  //onMount,fetch books from the API
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

  //onMount and if user.id changes, check if a token exists in localStorage and authenticate the user
  useEffect(() => {
    const loggedInToken = window.localStorage.getItem("token");
    if (loggedInToken) {
      authenticate(loggedInToken);
    }
  }, [user.id, authenticate]);

  const checkInBook = async (reservationId, bookId) => {
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

  const checkOutBook = async (bookId, user) => {
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

  // Function to get the reservation ID for a book by a user
  const checkRes = (book, user) => {
    const userReservations = user.reservations || [];
    return userReservations.find((reservation) => {
      return reservation.bookid === book.id;
    });
  };
  const getResId = (book, user) => {
    const reservation = checkRes(book, user);
    return reservation ? reservation.id : null;
  };

  function addDefaultImage(e) {
    e.target.src = "https://miro.medium.com/v2/1*94SsFbivh18YNKuiTEIkmA.jpeg";
  }

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
              user={user}
              getResId={getResId}
              checkRes={checkRes}
              checkInBook={checkInBook}
              checkOutBook={checkOutBook}
              addDefaultImage={addDefaultImage}
            />
          }
        />
        <Route
          path="/books/:id"
          element={
            <SingleBook
              books={books}
              user={user}
              getResId={getResId}
              checkRes={checkRes}
              checkInBook={checkInBook}
              checkOutBook={checkOutBook}
              addDefaultImage={addDefaultImage}
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
              checkInBook={checkInBook}
              addDefaultImage={addDefaultImage}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;

// FUTURE FEATURES:
// 1. MODIFY SEARCH TO PERFORM ON CHANGE, FILTERING BOOKS, BUT KEEPING CARDS VISUAL
// 1. Add a feature to allow users to update their profile information.
// 2. Implement a feature to allow users to view their reservation history.
// 3. Add a feature to allow users to search for books by author or genre.
// 4. Implement pagination for the book list to improve performance with large datasets.
