import githubIcon from "../assets/icons/github-icon.png";
import logo from '../assets/logo.svg'
import './styles/AboutPage.css';
// https://stock.adobe.com/search?k=%22carrot+cartoon%22
//https://stock.adobe.com/images/cute-bread-chibi-kawaii-cartoon-character-vector-illustration-template-design/854821590
const AboutPage = () => {
    return (
        <div className="about page">

            <div className="title">
                <h1>DiscoMeal</h1>
                <img className="logo" src={logo} alt="logo" />
            </div>
            

            <div className="text">
                <h2>Par projektu</h2>
                <p>Projekts sākotnēji tika izveidots personīgai lietošanai, taču tas kalpo arī kā demonstrācija manām tehniskajām zināšanām un spējām.</p>
                
                
                <div className="flex-row">
                    <p>
                        <a href="https://github.com/hix160/Disco-Meal">Projekta brīvpieejamo kodu </a> 

                        un šim līdzīgus projektus var apskatīt manā github profilā! 
                    </p>
                    
                    
                </div>
                <a href="https://github.com/hix160">
                    <img className="icon" src={githubIcon} alt="link" />
                </a>
                    
            </div>

            

           

        </div>
    );
};

export default AboutPage;
