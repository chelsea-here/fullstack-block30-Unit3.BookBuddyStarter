import { useSearchParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function Search({ books }) {
  let [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);

  const nameSearch = searchParams.get("book");
  const navigate = useNavigate();
  console.log(nameSearch);

  useEffect(() => {
    const result = books.filter((book) => {
      return book.title.toLowerCase().includes(nameSearch);
    });
    console.log(result);
    setSearchResults(result);
  }, [books, nameSearch]);

  const clearSearch = () => {
    setSearchResults([]);
    //alert('navigating to players')
    navigate(-1);
  };
  return (
    <div>
      {searchResults.length > 0 ? (
        searchResults.map((book) => {
          return (
            <div key={book.id}>
              <Link to={`/books/${book.id}`}>
                <h3>{book.title}</h3>
              </Link>
            </div>
          );
        })
      ) : (
        <p>No such book found</p>
      )}
      <br />
      <button onClick={() => clearSearch()}>Clear Search Results</button>
    </div>
  );
}
