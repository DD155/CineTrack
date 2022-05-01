import './Collection.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as cons from '../../constants';
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const Collection = () => {
    const navigate = useNavigate()

    let [collection, setCollection] = useState([])
    let [movies, setMovies] = useState([])
    let [shows, setShows] = useState([])

    const loadCollection = () => {
        let req = cons.SERVER_PATH + "getCollection"
        axios.post(req, {
            email: localStorage.getItem("email")        
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else {
                let data = res.data
                setCollection(data)
            }
        }).catch((err) => console.log(err))
    }

    const loadMovies = () => {
        axios.get(cons.SERVER_PATH + 'getAllMovies').then((res) => {
            if (res.data) {
                setMovies(res.data)
            } else {console.log("error")}
        })
    }

    const loadShows = () => {
        axios.get(cons.SERVER_PATH + 'getAllShows').then((res) => {
            if (res.data) {
                setShows(res.data)
            } else {console.log("error")}
        })
    }
        
    const createDiv = (key, obj) => {
        let path = obj.show_id === undefined ? cons.MOVIE_IMG_PATH + obj.title + '.jpg' : 
            cons.SHOW_IMG_PATH + obj.title + '.jpg' // image path 
        
        return (<div className = 'grid-item' key = {key} onClick = {() => goToDetails(obj)}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img style={{height: '450px'}} variant="top" src= {path} />
                        <Card.Body>
                            <Card.Title>{obj.title + ' (' + obj.year + ')'}</Card.Title>
                        </Card.Body>
                    </Card>
            </div>)
    }

    const displayContent = () => {
        if (movies.length < 1 || shows.length < 1) return
        let element
        let data = []
        for (let i = 0; i < collection.length; i++) {
            let current = collection[i]
            let isMovie = current.movie_id !== null ? true : false
            if (isMovie) {
                let movie = movies[current.movie_id-1]
                element = createDiv(i, movie)
            } else {
                let show = shows[current.show_id-1]
                element = createDiv(i, show)
            }
            data.push(element)
        }
        return (<div className = 'grid-container'>{data}</div>)
    }

    const goToDetails = (params) => {
        if (params.show_id === undefined) {
            navigate("/details/movie/" + params.movie_id)
        } else {
            navigate("/details/show/" + params.show_id)
        }
    }

    useEffect(() => {
        loadCollection()
        loadMovies() 
        loadShows()
    }, [])

    return (
    <div className="App">
        <div>
            <h1 className = 'text-center mt-3'> Collection</h1>  
            {displayContent()}
        </div>
    </div>
    );
}

export default Collection;
