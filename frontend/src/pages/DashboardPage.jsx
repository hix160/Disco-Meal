import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Discounts from '../components/Discounts';
import Recipes from '../components/Recipes';

import tempImg from '../assets/temp.jpg';
import './styles/DashboardPage.css';

const DashboardPage = () => {
    const [content, setContent] = useState(''); // State to track active content
    const [activeButton, setActiveButton] = useState('');

   
    const navigate = useNavigate();
    //const user = location.state?.user;
    const user = JSON.parse(sessionStorage.getItem('user'))


    // Redirect if user is not logged in
    useEffect(() => {
        if (!user) {
            navigate('/sign-in', { state: { message: 'Please log in first!' } });
        }
    }, [user, navigate]);

    const handleContentChange = (component) => {
        setContent(component);
        setActiveButton(component);
    };

    return user ? (
        <div className="dashboard page">
            <div className='navigation'>
                <div className='bar'>
                    <button 
                    onClick={() => handleContentChange('Discounts')}
                    className={activeButton === 'Discounts' ? 'active' : ''}
                    >Akcijas</button>

                    <button 
                    onClick={() => handleContentChange('Recipes')}
                    className={activeButton === 'Recipes' ? 'active' : ''}
                    >Manas Receptes</button>

                    <button 
                    onClick={() => handleContentChange('ShoppingList')}
                    className={activeButton === 'ShoppingList' ? 'active' : ''}
                    >Produktu Saraksts</button>

                    <button 
                    onClick={() => handleContentChange('Savings')}
                    className={activeButton === 'Savings' ? 'active' : ''}
                    >Mans Ietaupījums</button>

                    <button 
                    onClick={() => handleContentChange('Explore')}
                    className={activeButton === 'Explore' ? 'active' : ''}
                    >Gatavo Citi!</button>

                    <button 
                    onClick={() => handleContentChange('About')}
                    className={activeButton === 'About' ? 'active' : ''}
                    >Par</button>
                </div>
                
                <div className='profile'>
                    <img src={tempImg} alt="Profile" />
                    <div>@{user.username}</div>
                </div>
            </div>

            <div className='content'>
                {content === 'Discounts' && <Discounts />}
                {content === 'Recipes' && <Recipes />}
                {content === 'ShoppingList' && <div>Produktu Saraksts Content</div>}
                {content === 'Savings' && <div>Mans Ietaupījums Content</div>}
                {content === 'Explore' && <div>Gatavo Citi! Content</div>}
                {content === 'About' && <div>Par Content</div>}
            </div>
        </div>
    ) : null; // Show nothing while redirecting
};

export default DashboardPage;
