/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */

import { Link, useNavigate } from "react-router-dom";

export default function Books({
  books,
  user,
  checkRes,
  getResId,
  checkOutBook,
  checkInBook,
  addDefaultImage,
}) {
  const navigate = useNavigate();

  const searchForBooks = (formData) => {
    const target = formData.get("searchBar").toLowerCase();
    navigate(`/books/search/?book=${target}`);
  };
  const clickHandler = (book, user) => {
    const reservationId = getResId(book, user);
    checkInBook(reservationId, book.id);
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
        {books ? (
          books.map((book) => {
            return (
              <div key={book.id} className="card">
                <Link key={book.id} to={{ pathname: `/books/${book.id}` }}>
                  <img
                    src={book.coverimage}
                    alt={book.title}
                    className="bookcover"
                    onError={addDefaultImage}
                  />
                  <p>{book.title}</p>
                </Link>
                <span className="author"> {book.author}</span>
                <br />

                {window.localStorage.getItem("token") &&
                  (book.available ? ( // If the book is available, show the reserve button
                    <button onClick={() => checkOutBook(book.id, user)}>
                      Reserve
                    </button>
                  ) : checkRes(book, user) ? ( // If the book is not available, check if the user has a reservation
                    <button
                      className="return"
                      onClick={() => clickHandler(book, user)}
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
          })
        ) : (
          <p>Loading books...</p>
        )}
      </div>
    </div>
  );
}
