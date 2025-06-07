import { useNavigate } from "react-router-dom";

export default function Account({
  books,
  user,
  checkInBook,
  addDefaultImage,
  authenticate,
}) {
  const userReservations = user.reservations || [];
  function findBook(myBookId) {
    return books.find((book) => {
      return book.id === myBookId;
    });
  }
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem("token");
    authenticate(null);
    alert("You have been logged out.");
    navigate("/");
  };

  return (
    <div className="container">
      <hr />
      {user.id ? (
        <div>
          <h2>{user.firstname}'s Profile</h2>

          <p>
            Name: {user.firstname} {user.lastname}
          </p>
          <p>User ID: {user.id}</p>
          <p>Registered email: {user.email}</p>

          <hr />
          <div>
            <h3>My Reservations:</h3>
            <ol>
              {userReservations.length > 0 ? (
                userReservations.map((reservation) => {
                  let reservedBook = findBook(reservation.bookid);
                  return (
                    <li key={reservation.id}>
                      <p>Reservation ID: {reservation.id}</p>
                      <p>Book ID: {reservation.bookid}</p>
                      {reservedBook && (
                        <>
                          <img
                            src={reservedBook.coverimage}
                            alt={reservedBook.title}
                            className="bookcover"
                            onError={addDefaultImage}
                          />

                          <p>Book Title: {reservedBook.title}</p>
                          <p>Book Author: {reservedBook.author}</p>

                          <button
                            onClick={() =>
                              checkInBook(reservation.id, reservation.bookid)
                            }
                          >
                            Return Book
                          </button>
                        </>
                      )}
                      <hr />
                    </li>
                  );
                })
              ) : (
                <p>No reservations</p>
              )}
            </ol>
            <hr />
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      ) : (
        <p>User not found, please login...</p>
      )}
    </div>
  );
}
