import Link from "next/link";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
          {/* <img className ="logo" src="/assets/images/logo.png" alt="logo" /> */}
        </div>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Terms of service</Link>
            </li>
            <li>
              <Link href="/">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/contact">FAQs</Link>
            </li>
            <li>
              <Link href="/">About</Link>
            </li>
            <li>
              <Link href="/">Contact us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>support@example.com</p>
          <p>+123 456 7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Your Website. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
