
import "./styles/LandingPage.css";
import background from "../assets/landing_page_background.png";
import logo from '../assets/logo.svg'
import { Link } from "react-router-dom";

const LandingPage = () => {
    

    return (
        <div className="landing page">
         
            <div className="container">
                <div className="title">
                    <h1>DiscoMeal</h1>
                    <img src={logo} alt="" />
                </div>
                
                
                <div className="text">
                    <div>Esi izsalcis?</div>

                    <div>Apskaties atlaides un izveido receptes!</div>
                </div>

                <div className="btn-container">

                    <Link to="/sign-in">
                        <button className="linkbutton">Pieslēgties</button>
                    </Link>
                    <Link to="/about">
                        <button className="linkbutton">Par vietni</button>
                    </Link>
                </div>

                
            </div>

            <img className="background" src={background} alt="" />
            

        </div>
    );
};

export default LandingPage;
