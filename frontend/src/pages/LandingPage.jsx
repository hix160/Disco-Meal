import { useState, useEffect } from "react";
import "./styles/LandingPage.css";
import logoImage from "../assets/logo.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
    const fullTitle = "Katla Varonis"; // Full title text
    const [typedTitle, setTypedTitle] = useState(""); // State to hold the currently typed text
    const [typingComplete, setTypingComplete] = useState(false);

    useEffect(() => {
        if (typedTitle === fullTitle) {
            return;
        }

        let index = 0;

        // Function to type one letter at a time
        const typingInterval = setInterval(() => {
            if (index < fullTitle.length) {
                const nextChar = fullTitle.charAt(index); // Get the next character
                

                setTypedTitle((prev) => prev + nextChar); // Add the next character to typedTitle
                index++;
            } else {
                clearInterval(typingInterval);
                setTypingComplete(true);
            }
        }, 200); // 500ms delay between each letter

        return () => clearInterval(typingInterval); // Cleanup interval on unmount
    }, [fullTitle]);

    return (
        <div className="landing page">
            
            <div className="title capriola-regular">
                
                <h1>{typedTitle}</h1>
                <img className={`logo ${typingComplete ? "fade-in":""}`} src={logoImage} alt="Logo" />
            </div>

            <div className={`description ${typingComplete ? "fade-in":""}`}>
                <div>Atklāj labākos piedāvājumus veikalu produktiem</div>
                <div>un</div>
                <div>ietaupi uz ikdienas maltītēm!</div>
            </div>
            <div className="container">
                <Link to="/sign-in">
                    <button className="capriola-regular shadow linkbutton">Pieslēgties</button>
                </Link>
                <Link to="/about">
                    <button className="capriola-regular shadow linkbutton">Par vietni</button>
                </Link>
                
            </div>
            

        </div>
    );
};

export default LandingPage;
