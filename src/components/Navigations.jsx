/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
import { NavLink } from "react-router-dom";

export default function Navigations() {
  return (
    <div className="navbar">
      <div className="logo">
        <span>
          {"< "}Give a Hoot{" >"}
        </span>
      </div>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>{" "}
      <NavLink
        to="/books"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Books
      </NavLink>
      {window.localStorage.getItem("token") ? (
        <>
          {" "}
          <NavLink
            to="/account"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Account
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Logout
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Login
        </NavLink>
      )}
    </div>
  );
}
