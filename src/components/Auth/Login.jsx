/* TODO - add your code to create a functional React component that renders a login form */
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    }
  };

  return (
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
            Password:<input type="text" name="password" size="32"></input>
          </label>
          <br />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}
