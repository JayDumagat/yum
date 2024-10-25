import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to={"/login"} style={{ marginRight: "50px" }}>Login</Link>
      <Link to={"/register"} style={{ marginRight: "50px" }}>Register</Link>
      <Link to={"/ordering-home"}>App</Link>
    </div>
  );
}
