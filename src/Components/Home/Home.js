import './Home.css';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import bg from "../../assets/images/landing_bg.jpg"
import detail from "../../assets/images/details_example.PNG"
import collection from "../../assets/images/collection_example.PNG"

const Home = () => {
    const session = localStorage.getItem("session")
    const navigate = useNavigate()

    const [margin, setMargin] = useState('27vh')
    

    useEffect(() => {
        session === null ? setMargin('27vh') : setMargin('35vh')
    }, [])

    return (
    <div className = "home-container">
        <Carousel>
            <Carousel.Item className = 'text-center'> 
                <img className="d-block w-100" src={bg} alt="First slide" />
                <Carousel.Caption style={{ marginBottom: margin}}  className = "caption-text">
                    <h1>{'Welcome to '}
                        <div style={{color:'#912F40', display:'inline-block'}}>CineTrack</div>
                    </h1>
                    <p className='home-desc'>
                        CineTrack is a movie and TV show curator website that emphasizes minimalism and simplicty. This website lets users check out a catalog of movies and shows, keep track of what they want to watch, 
                        and engage with the community by leaving reviews. 
                    </p>
                    {session === null ? 
                        <Button variant='outline-light' size='lg' 
                            onClick = {() => navigate('/registration')}>
                            Get Started
                        </Button> : ''
                    } 
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={bg} alt="Second slide"/>
                <Carousel.Caption className = "caption-img">
                    <h1>Check out Your Favorite Movies and Shows</h1>
                    <img className="slide-pic" src={detail} alt="Second slide"/>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={bg} alt="Third slide" />
                <Carousel.Caption className = "caption-img">
                    <h1>Keep Track of Your Collection</h1>
                    <img className="collection-pic" src={collection} alt="Second slide"/>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    </div>
    );
}

export default Home;
