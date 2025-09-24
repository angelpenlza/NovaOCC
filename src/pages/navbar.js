import Link from "next/link";

export default function NavBar() {
  return ( 
    <div className="navbar">
      <h1>OurSafety</h1>
      <Link href="/maps">Maps</Link>
      <Link href="/news">News</Link>
      <Link href="/report">Report It</Link>
    </div>
  );
}