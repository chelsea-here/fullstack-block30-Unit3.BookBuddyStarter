/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Books({
  api,
  books,
  user,
  authenticate,
  reserves,
  setReserves,
}) {
  const navigate = useNavigate();
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
      setReserves(...reserves, data);
    } catch (error) {
      console.error(error);
    }
  };

  const returnBook = async (bookId) => {
    const getRes = (bookId) => {
      const userReservations = user.reservations;
      return userReservations.find((reservation) => {
        if (reservation.bookid === bookId) {
          return reservation;
        }
      });
    };
    const resId = getRes(bookId).id;
    // console.log(resId);

    try {
      await axios.delete(
        `${api}/reservations/${resId}`,
        // { resId: resId },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );
      const newReserves = reserves.filter((res) => {
        return res.id !== resId;
      });
      setReserves(newReserves);
    } catch (error) {
      console.error(error);
    }
  };

  const searchForBooks = (formData) => {
    const target = formData.get("searchBar").toLowerCase();
    navigate(`/books/search/?book=${target}`);
  };

  const checkRes = (bookId) => {
    const userReservations = user.reservations;
    return userReservations.find((reservation) => {
      return reservation.bookid === bookId;
    });
  };

  return (
    <div className="container">
      <hr />
      <h2>All of our Books</h2>
      <hr />
      <h3>Search for a specific book title here: </h3>
      <form action={searchForBooks}>
        <input type="text" name="searchBar"></input>
        <button>Search</button>
      </form>
      <hr />
      <div className="content">
        {books.map((book) => {
          return (
            <div key={book.id} className="card">
              <Link key={book.id} to={{ pathname: `/books/${book.id}` }}>
                <img
                  src={book.coverimage}
                  alt={book.title}
                  className="bookcover"
                />
                <p>{book.title}</p>
              </Link>
              <span className="author"> {book.author}</span>
              <br />

              {user.id &&
                (book.available ? (
                  <button onClick={() => reserveBook(book.id)}>Reserve</button>
                ) : checkRes(book.id) ? (
                  <button
                    className="return"
                    onClick={() => returnBook(book.id)}
                  >
                    Return Book
                  </button>
                ) : (
                  <p className="checkedOut">This book is not available.</p>
                ))}
              <div>
                <br />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
