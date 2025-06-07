import { useParams, Link } from "react-router-dom";

export default function SingleBook({
  books,
  user,
  reserveBook,
  removeResByBookId,
  checkRes,
}) {
  const params = useParams();
  const id = params.id * 1;
  const book = books.find((book) => {
    return book.id === id;
  });

  return (
    <div className="container">
      <hr />
      <h2>Book Details</h2>
      <hr />
      {book ? (
        <div className="content">
          <div className="cardDetail">
            <img
              src={book.coverimage}
              alt={book.title}
              className="bookcoverSingle"
            />
            <p>{book.title}</p>
            <span className="author"> {book.author}</span>
            <hr />
            <p>{book.description}</p>
            <p>Availability:</p>

            {window.localStorage.getItem("token") &&
              (book.available ? ( // If the book is available, show the reserve button
                <>
                  <p> This book is available</p>
                  <button onClick={() => reserveBook(book.id)}>Reserve</button>
                </>
              ) : checkRes(book, user) ? ( // If the book is not available, check if the user has a reservation
                <>
                  <p className="checkedOut">
                    You currently have this book checked out.
                  </p>
                  <button
                    className="return"
                    onClick={() => removeResByBookId(book.id, user)}
                  >
                    Return Book
                  </button>
                </>
              ) : (
                <p className="checkedOut">This book is not available.</p>
              ))}
          </div>
          <Link to="/books">Back to all Books</Link>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
