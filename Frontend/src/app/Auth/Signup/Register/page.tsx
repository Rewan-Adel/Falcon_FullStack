import "@/styles/auth.css";
import Link from "next/link";
import Auth from "@/components/Auth";

function Signup() {
  return (
    <div className="signup-page">
      <Auth
        title="Continue to Falcon"
        description="Select your signup account"
      />
      <div className="signup-content">  
        <div className="signup-buttons">
          <Link href="signup-google" className="signup-button google-button">
            Continue with Google
          </Link>
          <Link href="signup-email" className="signup-button email-button">
            Continue with Email
          </Link>
        </div>
        <p className="signup-terms">
          By continuing, you agree to our <b>Privacy Policy</b> and{" "}
          <b>Terms of Service</b>.
        </p>
      </div>
      
    </div>

  );
}

export default Signup;
