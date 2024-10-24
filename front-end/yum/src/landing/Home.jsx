import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <Link to={"/login"}>Login</Link>
      <Link to={"/register"}>Register</Link>
      <Link to={"/ordering-home"}>App</Link>
    </div>
  );
}
