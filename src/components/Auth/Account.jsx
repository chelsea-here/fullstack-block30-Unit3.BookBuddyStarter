/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import axios from "axios";

export default function Account({ user, reserves, setReserves, api }) {
  const userReservations = user.reservations;

  const removeReservation = async (reservationId) => {
    try {
      await axios.delete(`${api}/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setReserves(
        reserves.filter((res) => {
          res.id !== reservationId;
        })
      );
      console.log(reserves);
    } catch (error) {
      console.error(error);
    }
  };
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
            user.reservations.map((reservation) => {
              return (
                <li key={reservation.id}>
                  <p>Reservation ID: {reservation.id}</p>
                  <p>Book ID: {reservation.bookid}</p>
                  <p>Book Title: {reservation.title}</p>
                  <p>Book Author: {reservation.author}</p>
                  <button onClick={() => removeReservation(reservation.id)}>
                    Return Book
                  </button>
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

//todo: why isn't it loading upon refresh?
