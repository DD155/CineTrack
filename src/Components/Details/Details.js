import './Details.css';
import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Alert, Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import * as cons from '../../constants';
import axios from 'axios';

const Details = () => {
    let { id, type } = useParams()

    const session = localStorage.getItem("session")
    console.log(session)

    const [isAdded, setIsAdded] = useState(false)
    const [actors, setActors] = useState([])
    const [details, setDetails] = useState({})
    const [reviews, setReviews] = useState([])

    // for inputting a review
    const [description, setDescription] = useState('')
    const [rating, setRating] = useState(-1)
    const [isEdit, setIsEdit] = useState(false)

    // modal
    const [show, setShow] = useState(false);
    const closeModal = () => setShow(false);
    const openModal = () => setShow(true);

    let imgPath
    // in case details doesn't get set properly from db
    if (details.title !== null) {
        imgPath = type === 'movie' ? 
            cons.MOVIE_IMG_PATH + details.title + '.jpg' : cons.SHOW_IMG_PATH + details.title + '.jpg'
    }

    id = parseInt(id)

    const loadReviews = () => {
        let req = cons.SERVER_PATH + "getReviews"
        axios.post(req, {
            id: id, 
            type: type            
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
                setReviews(res.data)
            }
        }).catch((err) => console.log(err))
    }

    const loadDetails = () => {
        let req = cons.SERVER_PATH + "getDetails"
        axios.post(req, {
            id: id, 
            type: type            
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
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
            if (res.data.message) console.log(res.data.message)
            else {
                let data = res.data
                setActors(data)
            }
        }).catch((err) => console.log(err))
    }

    // used to see if the current show/movie is on the user's collection already or not
    const loadCollection = () => {
        let req = cons.SERVER_PATH + "getCollection"
        axios.post(req, {
            email: localStorage.getItem("email")        
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
                let data = res.data
                console.log(data)
                checkIfAddedToCollection(data)
            }
        }).catch((err) => console.log(err))
    }

    const checkIfAddedToCollection = (collection) => {
        for (let i = 0; i < collection.length; i++) {
            // get the id depending on if the user is viewing a movie or show currently
            let current = type === 'movie' ? collection[i].movie_id : collection[i].show_id
            if (current === id) setIsAdded(true)
        }
    }

    const displayActors = () => {
        let arr = []

        for (let i = 0; i < actors.length; i++) {
            let current = actors[i]
            arr.push(
                <div className = 'actor' key = {i} >
                    {current.first_name + " " + current.last_name}
                </div>
            )
        }
        return arr
    }

    const displayReviews = () => {
        let arr = []

        for (let i = 0; i < reviews.length; i++) {
            let current = reviews[i]
            let isOwnReview = reviews[i].email === localStorage.getItem('email')

            arr.push(
                <div key = {i}>
                    <div className = 'review-container' key = {i}>
                        <div className = 'author-container' style={{display: 'block'}}>
                            {isOwnReview ? <div className = 'delete' onClick = {() => openModal()} > Delete </div> : ''}
                            {isOwnReview ? <div className = 'edit' onClick = {() => editReview(current)}> Edit </div> : ''}
                            <div className = 'author'>{current.author}</div>
                            <div className = 'rating'>{current.rating} / 5</div>
                            <div className = 'date'> Created on: <br/> {current.date} </div>
                        </div>
                        <div className = 'vertical-line'></div>
                        <div className = 'description-text'> {current.description} </div>
                    </div>
                </div>
                
            )
        }
        return arr
    }

    const deleteReview = () => {
        let req = cons.SERVER_PATH + "deleteReview"
        axios.post(req, {
            email: localStorage.getItem("email"),
            id: id, 
            type: type 
        }).then((res) => {
            if (res.data.err) console.log(res.data.err)
            else window.location.reload()
        }).catch((err) => console.log(err))
    }

    const editReview = (review) => {
        window.location.hash = "input"
        setIsEdit(true)
        setRating(review.rating)
        setDescription(review.description)
    }

    const getFirstName = () => {
        let name = localStorage.getItem("name")
        console.log(name)
        return name.split(" ")[0]
    }

    const checkValidInput = () => {
        return description !== '' && description.length <= 500 && rating !== -1
    }

    const checkNewReview = () => {
        for (let i = 0; i < reviews.length; i++) 
            if (reviews[i].email === localStorage.getItem('email')) return false

        return true
    }

    const submitNewReview = () => {
        let req = cons.SERVER_PATH + "review"
        axios.post(req, {
            id: id, 
            type: type,
            email: localStorage.getItem("email"),
            author: getFirstName(),
            description: description,
            rating: rating 
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
                document.getElementById('warning-alert').style.display = 'none'
                document.getElementById('success-alert').style.display = 'block'
            }
        }).catch((err) => console.log(err))
    }
    
    const submitEditedReview = () => {
        let req = cons.SERVER_PATH + "editReview"
        axios.post(req, {
            email: localStorage.getItem("email"),
            description: description,
            rating: rating,
            id: id, 
            type: type,
            name: getFirstName()
        }).then((res) => {
            if (res.data.err) console.log(res.data.err)
            else {
                document.getElementById('warning-alert').style.display = 'none'
                document.getElementById('success-alert').style.display = 'block'
            }
        }).catch((err) => console.log(err))
    }

    // submits a review depending on if it is edited or a new review from a user
    const submitReview = () => {
        // make sure that the review is valid and not a duplicate submission
        if ((!checkValidInput() || !checkNewReview()) && !isEdit) { 
            document.getElementById('warning-alert').style.display = 'block'
            document.getElementById('success-alert').style.display = 'none'
            return
        }
        
        if (!isEdit) 
            submitNewReview()
        else
            submitEditedReview()
    }

    const addToCollection = () => {
        let req = cons.SERVER_PATH + "addToCollection"
        console.log(id)
        axios.post(req, {
            email: localStorage.getItem("email"),
            id: id, 
            type: type 
        }).then((res) => {
            if (res.data.err) {
                console.log(res.data.err)
            }
        }).catch((err) => console.log(err))
    }

    const removeFromCollection = () => {
        let req = cons.SERVER_PATH + "deleteFromCollection"
        axios.post(req, {
            email: localStorage.getItem("email"),
            id: id, 
            type: type 
        }).then((res) => {
            if (res.data.err) {
                console.log(res.data.err)
            } else console.log("deleted")
        }).catch((err) => console.log(err))
    }

    const handleCollectionSubmit = () => {
        let btn = document.getElementById('collection-btn')
        if (!isAdded) { 
            addToCollection()
            btn.innerHTML = "Added"
            setIsAdded(true)
        } else {
            removeFromCollection()
            btn.innerHTML = "Add to Collection"
            setIsAdded(false)
        }
    }

    useEffect(() => {
        loadDetails()
        loadReviews()
        loadActors()
        loadCollection()
    }, [])

    return (
    <div className="bg detail-container">
        <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton>
            <Modal.Title>Delete Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure that you want to delete your review? <br/> This action cannot be reverted.</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
                Close
            </Button>
            <Button variant="danger" onClick={deleteReview}>
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
        <div className="row">
            <div className="column">
                <div className = 'img-container'>
                    <img className = 'img' src = {imgPath} alt =''/>
                </div>
            </div>
            <div className="column">
                <div className = 'page-title title'> {details.title} </div>
                <div className = 'year'> {details.year} </div>
                <div className = 'content'> {details.description} </div>
                <div>
                    <div className = 'actor-heading'>Main Actors</div>
                    {displayActors()}
                </div>
                { session ? 
                <Button id='collection-btn' size="lg" onClick = {() => handleCollectionSubmit()} className = 'collection-btn'>
                    { isAdded ? "Added" : "Add to Collection" } </Button> : ''
                }
            </div>
        </div>
        <hr className = 'mt-2 mb-3'/>
        <div id = 'input' className = 'input-container'>
            { isEdit ? <h1 className = 'text-center'> Edit Your Review</h1> 
                : <h1 className = 'text-center'> Submit a Review </h1> 
            }<br/>
            <div id = 'alert-container'>
                <Alert id = 'success-alert' variant='success' style = {{display:'none'}}>
                    <Alert.Heading> Review Submitted </Alert.Heading>
                    <p> Your review has been sent successfully. Refresh the page to see the changes.</p>
                </Alert>

                <Alert id = 'warning-alert' variant='warning' style = {{display:'none'}}>
                    <Alert.Heading> Error </Alert.Heading>
                    <p> Please check that you have a valid rating or if your comment is not empty 
                        (maximum length is 500 characters). Only one review can be submitted per user.</p>
                </Alert>
            </div>

            {session ? 
            <Form className = 'text-center'>
                <Form.Select id = 'select' className = 'rating-select' as="select" value={rating}
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
                    <FloatingLabel style = {{color: 'black'}}className = 'floating-label' label = "Comments"> 
                        <Form.Control as="textarea" rows = "5" placeholder="comment"
                        value = {description}
                        style = {{height: '20vh'}}
                        onChange={(e) => setDescription(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Button onClick = {() => submitReview()}> Submit </Button>
            </Form> : <div className='text-center'> You must be logged in to submit a review. </div> 
            }
        </div> <br/>
        <hr className = 'mt-2 mb-3'/>
        <div className = 'reviews-container'>
            <h1 className = 'text-center'>Reviews</h1> 
            { reviews.length === 0 ? 
            <div className = 'empty-msg d-flex flex-column min-vh-100 justify-content-center align-items-center'>
                No reviews yet...
            </div> : displayReviews()
            }
        </div>        
        <br/> 
    </div>
    );
}

export default Details;
