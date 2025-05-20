import LogoImage from "../assets/owl-babelplatz.svg";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  return (
    <div className="home">
      <img src={LogoImage} id="logo-image" />
      {user.id ? (
        <div>
          <h1>Welcome to Your Library App, {user.firstname}!</h1>
          <hr />
          <div>
            <Link to="/account">Account Details</Link>
          </div>
          <hr />
          <h2>
            .. or would you like to see all of our{" "}
            <Link to="/books">books</Link> first?
          </h2>
        </div>
      ) : (
        <div>
          <h1>Welcome to My Library App!</h1> <hr />
          <div className="flexRow">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <hr />
          <h2>
            .. or would you like to see all of our{" "}
            <Link to="/books">books</Link> first?
          </h2>
        </div>
      )}
    </div>
  );
}
