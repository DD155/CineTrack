import './Details.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, FloatingLabel, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import * as cons from '../../constants';
import question_mark from '../../assets/images/question-circle.svg';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

const Details = () => {
    let { id, type } = useParams()

    const [showAlert, setShowAlert] = useState(false)

    const [actors, setActors] = useState([])
    const [details, setDetails] = useState({})
    const [reviews, setReviews] = useState([])

    // for inputting a review
    const [description, setDescription] = useState('')
    const [rating, setRating] = useState(-1)


    let imgPath
    // in case details doesn't get set properly from db
    if (details.title !== null) {
        imgPath = type === 'movie' ? 
            cons.MOVIE_IMG_PATH + details.title + '.jpg' : cons.SHOW_IMG_PATH + details.title + '.jpg'
    }

    id = parseInt(id)

    const loadDetails = () => {
        let req = cons.SERVER_PATH + "getDetails"
        axios.post(req, {
            id: id, 
            type: type            
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else {
                console.log(res)
                let data = res.data[0]
                setDetails(data)
            }
        }).catch((err) => console.log(err))
    }

    const loadActors = () => {
        let req = cons.SERVER_PATH + "getActors"
        axios.post(req, {
            id: id, 
            type: type            
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else {
                let data = res.data
                setActors(data)
            }
        }).catch((err) => console.log(err))
    }

    const displayActors = () => {
        let arr = []

        for (let i = 0; i < actors.length; i++) {
            let current = actors[i]
            arr.push(
                <div key = {i} >
                    {current.first_name + " " + current.last_name}
                </div>
            )
        }
        return arr
    }

    const getFirstName = () => {
        let name = localStorage.getItem("name")
        return name.split(" ")[0]
    }

    const checkValidInput = () => {
        return description !== '' && rating !== -1
    }

    const submitReview = () => {
        console.log(checkValidInput())
        if (!checkValidInput()) {
            document.getElementById('warning-alert').style.display = 'block'
            document.getElementById('success-alert').style.display = 'none'
            return
        }
        let req = cons.SERVER_PATH + "review"
        axios.post(req, {
            id: id, 
            type: type,
            email: localStorage.getItem("email"),
            author: getFirstName(),
            description: description,
            rating: rating 
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else {
                document.getElementById('warning-alert').style.display = 'none'
                document.getElementById('success-alert').style.display = 'block'
            }
        }).catch((err) => console.log(err))
    }


    useEffect(() => {
        loadDetails()
        loadActors()
    }, [])

    return (
    <div className="App">
        <div className="row">
            <div className="column">
                <div className = 'img-container'>
                    <img className = 'img' src = {imgPath} alt =''/>
                </div>
            </div>
            <div className="column">
                <div className = 'title'> {details.title} </div>
                <div className = 'year'> {details.year} </div>
                <div>
                    {displayActors()}
                </div>
            </div>
        </div>
        <hr className = 'mt-2 mb-3'/>
        <div className = 'input-container'>

            <h1 className = 'text-center'> Submit a Review </h1> <br/>
            <div id = 'alert-container'>
                <Alert id = 'success-alert' variant='success' style = {{display:'none'}}>
                    <Alert.Heading> Review Submitted </Alert.Heading>
                    <p> Your review has been sent successfully. Refresh the page to see the changes.</p>
                </Alert>

                <Alert id = 'warning-alert' variant='warning' style = {{display:'none'}}>
                    <Alert.Heading> Error </Alert.Heading>
                    <p> Please check that you have a valid rating or if your comment is not empty.</p>
                </Alert>
            </div>

            <Form className = 'text-center'>
                <Form.Select className = 'rating' as="select" value={rating}
                onChange={e => setRating(parseInt(e.target.value))}>
                    <option value={-1}>Select rating...</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Select>
                <br/>
                <Form.Group className = "textarea mb-3">
                    <FloatingLabel label = "Comments"> 
                        <Form.Control as="textarea" rows = "5" placeholder="comment"
                        style = {{height: '20vh'}}
                        onChange={(e) => setDescription(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Button onClick = {() => submitReview()}> Submit </Button>
            </Form>
        </div> <br/>
        <hr className = 'mt-2 mb-3'/>
        <div className = 'reviews-container'>
            <h1 className = 'text-center'>Reviews</h1> 
            { reviews.length === 0 ? 
            <div className = 'empty-msg d-flex flex-column min-vh-100 justify-content-center align-items-center'>
                No reviews yet...
            </div> : ''
            }
        </div>        
        <br/> 
    </div>
    );
}

export default Details;
