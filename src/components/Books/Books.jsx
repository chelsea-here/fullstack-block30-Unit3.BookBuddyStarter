/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */

import { Link } from "react-router-dom";
import axios from "axios";

export default function Books({
  api,
  books,
  user,
  authenticate,
  reserves,
  setReserves,
}) {
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
      console.log(data);
      setReserves(...reserves, data);
      console.log("reserves", reserves);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <hr />
      <h2>All of our Books</h2>
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
              {book.available && <p>available to reserve</p>}
              {user.id && book.available && (
                <button onClick={() => reserveBook(book.id)}>Reserve</button>
              )}

              <div>
                <br />
                <p>have you reserved it?</p>
                {/* is it available? 
                are you logged in?
                  //have you already reserved it? 
                  // if not,
                  reserve button */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
