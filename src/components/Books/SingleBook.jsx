/* TODO - add your code to create a functional React component that renders details for a single book. Fetch the book data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */
import { useParams, Link} from "react-router-dom"

export default function SingleBook ({books}) {
  const params = useParams();
  const  id = params.id*1;
  console.log(`params id: ${id}`);
  const book = books.find((book) => {
    return book.id === id;
  })
  console.log(book)
  return (
        <div className="container">
      <hr />
    <h2>Book Details</h2>
    <hr />
    { book ? (    <div className="content">
       <div className="cardDetail">
        <img src={book.coverimage} alt={book.title} className="bookcoverSingle"/>
        <p>{book.title}</p>
        <span className="author"> {book.author}</span>
        <hr />
        <p>{book.description}</p>
        <p>Availability:</p>
        {book.available ? <p>Available to Reserve</p> : <p>This book is not currently available</p>}
        </div>
      <Link to="/books">Back to all Books</Link></div>) : <h2>Loading...</h2>}
      
      </div>
)}