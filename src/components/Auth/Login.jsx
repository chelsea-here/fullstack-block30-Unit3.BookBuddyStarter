/* TODO - add your code to create a functional React component that renders a login form */
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ api, authenticate }) {
  const navigate = useNavigate();

  const login = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const user = {
      email,
      password,
    };
    try {
      const { data } = await axios.post(`${api}/users/login`, user);
      console.log(data);

      window.localStorage.setItem("token", data.token);
      authenticate(window.localStorage.getItem("token"));
      alert("Thank you, for logging in!");
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password. Please try again.");
      } else {
        alert("An error occurred while logging in. Please try again later.");
      }
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    authenticate(null);
    alert("You have been logged out.");
    navigate("/");
  };

  return window.localStorage.getItem("token") ? (
    <div>
      <p>You are already logged in! Would you like to logout?</p>
      <hr />
      <button onClick={logout}>Logout</button>
      <hr />
    </div>
  ) : (
    <div className="container">
      <hr />
      <h2>Login Form</h2>
      <hr />
      <div className="content">
        <form action={login}>
          <label>
            Email:<input type="email" name="email" size="32"></input>
          </label>
          <br />
          <label>
            Password:<input type="password" name="password" size="32"></input>
          </label>
          <br />
          <button>Submit</button>
        </form>
        <hr />
        <div>
          <p>
            Need to register as a new member?{" "}
            <Link to="/register">Register here.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
