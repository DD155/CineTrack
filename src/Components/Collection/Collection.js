import './Collection.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as cons from '../../constants';
import { Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const Collection = () => {
    const navigate = useNavigate()

    let [movies, setMovies] = useState([])
    let [shows, setShows] = useState([])

    let [watched, setWatched] = useState([])
    let [notWatched, setNotWatched] = useState([])

    const loadCollection = () => {
        let req = cons.SERVER_PATH + "getCollection"
        axios.post(req, {
            email: localStorage.getItem("email")        
        }).then((res) => {
            console.log(res.data.message)
            if (res.data.message !== undefined) {
                //document.getElementById("collection-container").style.display = 'none'
                //document.getElementById("empty").style.display = 'block'
            }
            else {
                let data = res.data
                let arrWatched = [], arrNotWatched = []
                for (let i = 0; i < data.length; i++) {
                    (data[i].isWatched === 1) ? arrWatched.push(data[i]) : arrNotWatched.push(data[i])
                }
                setWatched(arrWatched)
                setNotWatched(arrNotWatched)
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

    const removeFromCollection = (id, type) => {
        let req = cons.SERVER_PATH + "deleteFromCollection"
        axios.post(req, {
            email: localStorage.getItem("email"),
            id: id, 
            type: type 
        }).then((res) => {
            if (res.data.err) {
                alert(res.data.err)
            } else window.location.reload()
        }).catch((err) => console.log(err))
    }

    const toggleStatus = (status, id) => {
        let req = cons.SERVER_PATH + "toggleCollectionStatus"
        axios.post(req, {
            id: id, 
            status: status
        }).then((res) => {
            if (res.data.err) {
                alert(res.data.err)
            } else window.location.reload()
        }).catch((err) => console.log(err))
    }
        
    // takes in the key, movie/show object, and the current collection object
    const createDiv = (key, obj, collection) => {
        let path, id, type

        if (obj.show_id === undefined) {
            type = "movie"
            path = cons.MOVIE_IMG_PATH + obj.title + '.jpg'
            id = obj.movie_id
        } else {
            type = "show"
            path = cons.SHOW_IMG_PATH + obj.title + '.jpg'
            id = obj.show_id
        }

        let msg = collection.isWatched === 0 ? "Mark as Watched" : "Mark as To Watch"
        
        return (<div className = 'grid-item-i' key = {key}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img onClick = {() => goToDetails(obj)} style={{height: '450px', cursor:'pointer'}} variant="top" src= {path} />
                        <Card.Body>
                            <Card.Title>{obj.title + ' (' + obj.year + ')'}</Card.Title>
                            <div className = 'button-container'>
                                <Button variant='outline-danger' 
                                    onClick = {() => removeFromCollection(id, type)}>Remove</Button>
                                <Button variant='outline-secondary' 
                                    onClick = {() => toggleStatus(collection.isWatched, collection.id)}>{msg}</Button>
                            </div>
                        </Card.Body>
                    </Card>
            </div>)
    }

    const displayContent = (collection) => {
        if (movies.length < 1 || shows.length < 1) return
        let element
        let data = []
        for (let i = 0; i < collection.length; i++) {
            let current = collection[i]
            let isMovie = current.movie_id !== null ? true : false
            if (isMovie) {
                let movie = movies[current.movie_id-1]
                element = createDiv(i, movie, current)
            } else {
                let show = shows[current.show_id-1]
                element = createDiv(i, show, current)
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
    <div className = 'mt-3'>
        <div id = 'empty' className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
                Add some movies or shows to your collection to see them here.
        </div>
        <div id = 'collection-container'>
            <div className = 'watched-container'>
                <h2>Watched</h2>
                <div className = 'watched'></div>
                {watched.length === 0 ? 
                <div className = 'text-center'>Mark movies or shows as watched to list them here</div>
                : displayContent(watched)}
                <hr/>
            </div>
            <div className = 'not-watched-container'>
                <h2>To Watch</h2>
                <div className = 'not-watched'></div>
                {notWatched.length === 0 ? 
                <div className = 'text-center' style={{height: '20vh'}}>Movies or shows that you haven't watched will be here</div>
                : displayContent(notWatched)}
            </div>       
        </div>
    </div>
    );
}

export default Collection;
