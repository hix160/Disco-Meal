import githubIcon from "../assets/icons/github-icon.png";
import logoImage from "../assets/logo.png";
import './styles/AboutPage.css';
// https://stock.adobe.com/search?k=%22carrot+cartoon%22
//https://stock.adobe.com/images/cute-bread-chibi-kawaii-cartoon-character-vector-illustration-template-design/854821590
const AboutPage = () => {
    return (
        <div className="about page">

            <div className="title capriola-regular">
                <h1 >Katla varonis</h1>
                <img className="logo" src={logoImage} alt="logo" />
            </div>
            

            <div className="info container">
                <h2>Par projektu</h2>

                <div>
                    <p>Projekts sākotnēji tika izveidots personīgai lietošanai, taču tas kalpo arī kā demonstrācija manām tehniskajām zināšanām un spējām.</p>
                    
                </div>

                <div>
                    <p>Projekta brīvpieejamo kodu var atrast <a href="">šeit</a>.</p>
                    
                </div>

                <div>
                    <p>Dokumentāciju un instrukcijas var atrast <a href="">šeit</a>.</p>
                    
                </div>

                <div className="flex-row">
                    <p>Līdzīgus projektus var apskatīt manā  GitHub profilā! </p>
                    <a href="https://github.com/hix160"><img className="icon" src={githubIcon} alt="link" /></a>
                    
                </div>

                

                
                
            </div>
            
        </div>
    );
};

export default AboutPage;
