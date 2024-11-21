"use client";
import Auth from '@/components/Auth'
import '@/styles/auth.css'
import VerificationInput from '@/components/VerificationInput'

import Image from 'next/image'
import Link from 'next/link'

function Verify(){
    const handleComplete = (code: string) => {
        // Send the code to the server
        console.log("الكود اللي دخلتيه:", code);
    }

    return(
        <div className="signup-email">
            <Link className='arrow' href="/Auth/Signup/signup-email">
                <Image src="/assets/icon/left.png" 
            width={25} height={30} alt="logo" />
            </Link>
            <Auth 
                title="Sign Up"
                description="Please enter your verification code below"
            />
            
            <div className="signup-email-form">
                    <div className="form-group">
                        <VerificationInput 
                            length={6}
                            onComplete={handleComplete} 
                        />
                    </div>

                    <Link href="/Auth/Verify/code">
                    <button className='next-btn' type="submit">Next</button>
                    </Link>
        </div>
        </div>
    )

}

export default Verify;