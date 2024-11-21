import Auth from '@/components/Auth'

function Verify_Code(){
    return(
        <div className="signup-email">
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

export default Verify_Code;