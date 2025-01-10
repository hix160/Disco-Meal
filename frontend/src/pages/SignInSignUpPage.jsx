import { useState } from "react";
import './styles/SignInSignUpPage.css'
import { useNavigate } from "react-router-dom";


const SignInSignUpPage = () => {
    const [isSignIn, setSignIn] = useState(true);
    const [formData, setFormData] = useState({username:"", password:""});
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const toggleForm = () => {
        setSignIn(!isSignIn);
        setMessage("");
        setFormData({username:"", password:""});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiEndpoint = isSignIn ? "/api/sign-in" : "/api/sign-up";

        try {
            const res = await fetch(apiEndpoint, {
                method:"POST",
                headers:{"Content-Type" : "application/json"},
                body: JSON.stringify(formData),
            });
    
            const data = await res.json() //gaidām atbilid par lietotāju
            
            if(res.ok) {
                setMessage(isSignIn ? "Lietotājs pierakstījies" : "Lietotājs tika reģistrēts");

                if(isSignIn) {
                    
                    sessionStorage.setItem('user', JSON.stringify(data))
                    navigate("/dashboard", {state: {user:data}});
                }

            }
            else {
                setMessage(data.message || (isSignIn ? "Failed to sign in" : "Failed to register"))
            }
        } catch (error) {
            setMessage("An error occured: " + error.message);
        }
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value});
    };

    return (
        <div className="singin-signup page">

            <div className="form-container shadow">

                <h1>{isSignIn ? "Ieiet kontā" : "Izveidot kontu"}</h1>

                <p>{message}</p>

                <form onSubmit={handleSubmit}>

                    <div className="input-wraper">

                        <input 
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required />

                        <label htmlFor="username">Lietotāj vārds</label>
                    </div>

                    <div className="input-wraper">

                        <input 
                        type="password"
                        id="passwprd"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required />

                        <label htmlFor="password">Parole</label>
                    </div>

                    <button type="submit">{isSignIn ? "Pieslēgties" : "Reģistrēties"}</button>
                    
                </form>

                

                <div className="switch-container">
                    <label className="toggle-switch">
                        <input type="checkbox"
                        checked={!isSignIn}
                        onChange={toggleForm} 
                        />
                        <div className="toggle-background">
                            <div className="toggle-handle"></div>
                        </div>
                        <span className="slider"></span>
                    </label>
                    <span className="toggle-text">{isSignIn ? "Reģistrēties" : "Pieslēgties"}</span>
                </div>
                


                
            </div>

        </div>
    )


}

export default SignInSignUpPage;