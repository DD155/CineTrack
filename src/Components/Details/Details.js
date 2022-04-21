import './Details.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as cons from '../../constants';
import axios from 'axios';

const Details = () => {
    let { id, type } = useParams()
    const [details, setDetails] = useState({})
    const imgPath = type === 'movie' ? 
        cons.MOVIE_IMG_PATH + details.title + '.jpg' : cons.MOVIE_IMG_PATH + details.title + '.jpg'


    id = parseInt(id)

    const loadDetails = () => {
        if (type === 'movie') {
            let req = cons.SERVER_PATH + "getDetails"
            axios.post(req, {
                id: id, 
                type: type            
            }).then((res) => {
                if (res.data.message) alert(res.data.message)
                else {
                    let data = res.data[0]
                    setDetails(data)
                }
            }).catch((err) => console.log(err))
        } else {

        }
    }

    const displayDetails = () => {
        if (details !== {})
            console.log(details)
    }
    displayDetails()

    useEffect(() => {
        loadDetails()
        window.scrollTo(0, 0)
    }, [])

    return (
    <div className="App">
         <div className="row">
            <div className="column">
                <div className = 'img-container'>
                    <img className = 'img' src = {imgPath} alt ='' ></img>
                </div>
            </div>
            <div className="column">
                <div className = 'title'> {details.title} </div>
                <div className = 'year'> {details.year} </div>
            </div>
        </div> 
    </div>
    );
}

export default Details;
