export default function Account({ user, removeReservation, books }) {
  const userReservations = user.reservations || [];
  function findBook(myBookId) {
    return books.find((book) => {
      return book.id === myBookId;
    });
  }

  return (
    <div className="container">
      <hr />
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
                      <p>
                        Book Cover:{" "}
                        <img
                          src={reservedBook.coverimage}
                          alt={reservedBook.title}
                          className="bookcover"
                        />
                      </p>
                      <p>Book Title: {reservedBook.title}</p>
                      <p>Book Author: {reservedBook.author}</p>

                      <button
                        onClick={() =>
                          removeReservation(reservation.id, reservation.bookid)
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
      </div>
    </div>
  );
}
