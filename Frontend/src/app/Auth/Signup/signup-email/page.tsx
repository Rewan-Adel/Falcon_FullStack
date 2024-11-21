import Auth from '@/components/Auth'
import '@/styles/auth.css'
import Image from 'next/image'
import Link from 'next/link'
function Signup_email(){
    return(
        <div className="signup-email">
            <Link className='arrow' href="/Auth/Signup/Register">
                <Image src="/assets/icon/left.png" 
            width={25} height={30} alt="logo" />
            </Link>
            <Auth 
                title="Sign Up"
                description="Please enter details below"
            />
            <div className="signup-email-form">
                
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Enter your email</label>
                        <br></br>
                        <input className='email-input' type="email" id="email" name="email" placeholder="Enter your email" required />
                    </div>
                    <Link href="/Auth/Verify">
                    <button className='next-btn' type="submit">Next</button>
                    </Link>
                </form>
        </div>
        </div>
    )

}

export default Signup_email;