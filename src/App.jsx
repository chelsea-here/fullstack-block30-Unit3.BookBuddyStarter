import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
// import LogoImage from "./assets/owl-babelplatz.svg"

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
  // const [reserves, setReserves] = useState([]); //refactoring to remove reserves state

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
        //do i need to set user to null here?
        setUser({});
        throw Error("no token found");
      }
      const response = await axios.get(`${api}/users/me`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      console.log("User authenticated:", response.data);
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

  // useEffect(() => {
  //   const fetchReserves = async () => {
  //     try {
  //       const { data } = await axios.get(`${api}/reservations`, {
  //         headers: {
  //           Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  //         },
  //       });
  //       setReserves(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   const loggedInToken = window.localStorage.getItem("token");
  //   if (loggedInToken) {
  //     fetchReserves();
  //   }
  // }, [user.id]);

  //in middle of updating with add bookid
  const removeReservation = async (reservationId, bookId) => {
    try {
      await axios.delete(`${api}/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      // setReserves(
      //   reserves.filter((res) => {
      //     res.id !== reservationId;
      //   })
      // );
      setUser(
        user.reservations.filter((res) => {
          res.id !== reservationId;
        })
      );
      console.log("User reservations after removal:", user.reservations);
      const updatedBooks = books.map((book) => {
        if (book.id == bookId) {
          return { ...book, available: true };
        }
        return book;
      });
      setBooks(updatedBooks);
      console.log("Updated books after removal:", updatedBooks);
      console.log("Reservation removed:", reservationId);
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
    console.log("Removing reservation with ID:", resId);
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
      // setReserves([...reserves, data]);
      // console.log(data);
      // console.log("Reserves updated:", reserves);
      setUser({
        ...user,
        reservations: [...user.reservations, data],
      });
      /// TODO: setReserves to include the new reservation
      /// We suspect reserves is not being updated correctly for user
      const updatedBooks = books.map((book) => {
        if (book.id === bookId) {
          console.log("Attempting to checkout book:", book);
          return { ...book, available: false }; // Mark the book as reserved
        }
        return book;
      });
      setBooks(updatedBooks);
      console.log("Updated books:", updatedBooks);
      console.log("Book reserved:", data);
      console.log("User updated:", user);
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
