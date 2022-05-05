import './Movies.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as cons from '../../constants';
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';


const Movies = () => {
    let navigate = useNavigate()
    const [movies, setMovies] = useState([])

    const setMovieData = () => 
        axios.get(cons.SERVER_PATH + 'getAllMovies').then((res) => {
        if (res.data) {
            setMovies(res.data)
        } else {console.log("error")}
    })

    const createCard = (title, year) => {
        let path = cons.MOVIE_IMG_PATH + title + '.jpg' // image path 
        return (
            <Card className = 'd-flex' style={{ width: '18vw' }}>
                <Card.Img style={{height: '50vh'}} variant="top" src= {path} />
                <Card.Body className='align-items-center '>
                    <Card.Title className ='card-content m-auto'>{title + ' (' + year + ')'}</Card.Title>
                </Card.Body>
            </Card>
        )
    }

    const goToDetails = (params) => {
        navigate("/details/movie/" + params.movie_id)
    }

    const displayMovies = () => {
        let data = []
        for (let i = 0; i < movies.length; i++) {
            let current = movies[i]
            let element = 
            <div className = 'grid-item' key = {i} onClick = {() => goToDetails(current)}>
                {createCard(current.title, current.year)}
            </div>
            data.push(element)
        }
        return (<div className = 'grid-container'>{data}</div>)
    }

    useEffect(() => {
        setMovieData()
    }, [])

    return (
    <div className="bg no-scroll">
        <div>
            <h1 className = 'text-center mt-3' style = {{color: '#912F40'}}> Movies</h1>  
            {displayMovies()}
        </div>
    </div>
    );
}

export default Movies;
