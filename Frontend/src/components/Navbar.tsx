import Link from "next/link";
import Image from "next/image";
function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">
        <Image className="logo" src="/assets/icon/logo.png" width={128} height={77} alt="logo" />
      </Link>

      <div className="basic">
        <Link href="/Marketplace">Marketplace</Link>
        <Link href="/Portfolios">Portfolios</Link>
        <Link href="/">About</Link>
      </div>

      <div className="auth-btn">
        <Link className="btn login" href="/Auth/Login">Login</Link>
        <Link className="btn signup" href="/Auth/Signup/Register">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
