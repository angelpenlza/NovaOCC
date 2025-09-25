import Link from "next/link";

export default function NavBar() {
  return ( 
    <div className="navbar">
      <Link className="title" href="/">OurSafety</Link>
      <Link className="navitem" href="/news">Trending</Link>
      <Link className="navitem" href="/login">Login</Link>
    </div>
  );
}