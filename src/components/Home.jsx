import LogoImage from "../assets/owl-babelplatz.svg"
import { Link } from "react-router-dom"

export default function Home () {
  return (
    <div className="home">
      <img src={LogoImage} id='logo-image'/>
      <h1>Welcome to My Library App!</h1>
      <h2>Would you like to see all of our <Link to="/books">books</Link>?</h2> 
    </div>
  )
}