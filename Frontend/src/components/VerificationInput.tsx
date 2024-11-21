// Purpose: Create a component that will be used to input a verification code.
"use client";
import "@/styles/auth.css"
import React, { useState, useRef } from "react";

type InputProps = {
    length: number;
    onComplete: (code: string) => void;
};

function VerificationInput({length = 6, onComplete}: InputProps){
    // The value of the input, an array of length 6
    let [values, setValues] = useState(Array(length).fill('')); // Initialize the value with 6 empty strings

    // Handle the change of the input, when user types in the input field (each digit)
    let handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const {value} = e.target;
        if (!/^\d*$/.test(value)) return; // Allow numbers only

        let newValue = [...values];// Copy the value
        newValue[index] = value.slice(-1); //take the last character of the value    
        setValues(newValue); // Update the value

        // move to the next input field
        if (value && index < length - 1){
            (e.target.nextElementSibling as HTMLInputElement)?.focus();
        }

        
        if (newValue.every((digit) => digit !== "")) {
            onComplete(newValue.join(""));
        }
    };
    
    const handleKeyDown = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            (e.target.previousElementSibling as HTMLInputElement)?.focus();
            }
    };
    

    return(
        <div className="verification-code-container">
               {/* // Create 6 input fields */}
              {values.map((value, index) => (
                <input
                    key={index} //key is used to identify the element
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value} //value is the value of the input field
                    onChange={(e) => handleChange(e, index)} //onChange is called when the value of the input field changes
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="verification-code-input"
                    autoFocus={index === 0} //focus on the first input field
                />
            ))}
        </div>
    )
};

export default VerificationInput;