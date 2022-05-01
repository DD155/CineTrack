import './Shows.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import * as cons from '../../constants';
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';


const Shows = () => {
    let navigate = useNavigate()
    const [shows, setShows] = useState([])

    const setShowData = () => 
        axios.get(cons.SERVER_PATH + 'getAllShows').then((res) => {
        if (res.data) {
            console.log(res.data)
            setShows(res.data)
        } else {console.log("error")}
    })

    const createCard = (title, year) => {
        let path = cons.SHOW_IMG_PATH + title + '.jpg' // image path 
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img style={{height: '450px'}} variant="top" src= {path} />
                <Card.Body>
                    <Card.Title>{title + ' (' + year + ')'}</Card.Title>
                </Card.Body>
            </Card>
        )
    }

    const goToDetails = (params) => {
        navigate("/details/shows/" + params.show_id)
    }

    const displayShows = () => {
        if (shows === null) return
        let data = []
        for (let i = 0; i < shows.length; i++) {
            let current = shows[i]
            let element = 
            <div className = 'grid-item' key = {i} onClick = {() => goToDetails(current)}>
                {createCard(current.title, current.year)}
            </div>
            data.push(element)
        }
        return (<div className = 'grid-container'>{data}</div>)
    }

    useEffect(() => {
        setShowData()
    }, [])

    return (
    <div className="App">
        <div>
            <h1 className = 'text-center mt-3'> Shows</h1>  
            {displayShows()}
        </div>
    </div>
    );
}

export default Shows;
