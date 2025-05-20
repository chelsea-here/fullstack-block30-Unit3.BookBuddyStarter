import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* TODO - add your code to create a functional React component that renders a registration form */
export default function Register({ api }) {
  const navigate = useNavigate();

  const register = async (formData) => {
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    const user = {
      firstname,
      lastname,
      email,
      password,
    };
    try {
      const { data } = await axios.post(`${api}/users/register`, user);
      console.log(data.token);
      alert("Thank you for signing up! Now, please login.");
      navigate("/login");
      // ALTERNATIVELY I COULD ADD TOKEN TO LOCAL STORAGE HERE AND RUN AUTHENTICATE
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container">
      <hr />
      <h2>Welcome! Sign up to Reserve our Books!</h2>
      <p>
        Already a member? <Link to="/login">Login here.</Link>
      </p>
      <hr />
      <div className="content">
        <form action={register}>
          <label>
            First Name: <input type="text" name="firstname"></input>
          </label>
          <br />
          <label>
            Last Name: <input type="text" name="lastname"></input>
          </label>
          <br />
          <label>
            Email: <input required type="email" name="email"></input>
          </label>
          <br />
          <label>
            Password: <input required type="text" name="password"></input>
          </label>
          <br />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}
