import './Profile.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap'
import * as cons from '../../constants'

const Profile = () => {
    const navigate = useNavigate()
     
    const [numReviews, setNumReviews] = useState(0)
    const [numMovies, setNumMovies ] = useState(0)
    const [numShows, setNumShows ] = useState(0)

    const [show, setShow] = useState(false);
    const closeModal = () => setShow(false);
    const openModal = () => setShow(true);

    const [showEditModal, setshowEditModal] = useState(false);

    const fullName = localStorage.getItem('name')

    const [firstName, setFirstName] = useState(fullName.split(' ')[0])
    const [lastName, setLastName] = useState(fullName.split(' ')[1])
    const [password, setPassword] = useState('')

    const email = localStorage.getItem("email")

    const getReviewsCount = () => {
        let req = cons.SERVER_PATH + "getUsersReviews"
        axios.post(req, {
            email: email,
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
                setNumReviews(res.data.length)
            }
        })
    }

    const getCollection = () => {
        let req = cons.SERVER_PATH + "getCollection"
        axios.post(req, {
            email: localStorage.getItem("email")        
        }).then((res) => {
            if (res.data.message) console.log(res.data.message)
            else {
                let data = res.data
                let shows = 0, movies = 0
                for (let i = 0; i < data.length; i++) {
                    if (data[i].isWatched === 1) {
                        console.log(data[i]);
                        (data[i].show_id !== null) ? shows++ : movies++
                    }  
                }
                setNumMovies(movies)
                setNumShows(shows)
            }
        }).catch((err) => console.log(err))
    }


    const deleteAccount = () => {
        let req = cons.SERVER_PATH + "deleteUser"
        axios.post(req, {
            email: localStorage.getItem("email"),
            password: password
        }).then((res) => {
            console.log(res)
            if (res.data.message === "Password error") alert("Incorrect password, please try again.")
            else {
                setTimeout(() => {
                    localStorage.clear()
                    navigate('/login')
                }, 1000)
            }
        }).catch((err) => console.log(err))   
    }

    const checkValidInfo = () => {
        return (firstName.length < 15 && lastName.length < 15) 
            && (!/[^a-zA-Z]/.test(firstName)) && (!/[^a-zA-Z]/.test(lastName))
    }

    const updateUserInfo = () => {
        if (checkValidInfo()) {
            let req = cons.SERVER_PATH + "updateUserInfo"
            axios.post(req, {
                email: localStorage.getItem("email"),
                firstName: firstName,
                lastName: lastName,
                password: password
            }).then((res) => {
                console.log(res)
                if (res.data.message === "Password error") alert("Incorrect password, please try again.")
                else {
                    setTimeout(() => {
                        localStorage.setItem("name", firstName + " " + lastName)
                        window.location.reload()
                    }, 1000)
                }
            }).catch((err) => console.log(err))  
        } else {
            alert("Please make sure your first name and last name do not exceed 15 characters and only contain letters.")
        }
         
    }

    useEffect(() => {
        getReviewsCount()
        getCollection()
    }, [])


    return (
        <div className="bg d-flex flex-column justify-content-center align-items-center">
            {/* Delete Account Modal */}
            <Modal show={show} onHide={closeModal}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure that you want to delete your account? <br/> This is permanent! <br/>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter your password</Form.Label>
                            <Form.Control type="password" 
                            onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button variant="danger" onClick={deleteAccount}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Info Modal */}
            <Modal show={showEditModal} onHide={() => setshowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" value = {firstName}
                            onChange={(e) => setFirstName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text"  value = {lastName}
                            onChange={(e) => setLastName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" 
                            onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setshowEditModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={updateUserInfo}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>


            <div className = 'details-container'>
                <div className = 'name'> {fullName} </div>
                <div className = 'email'> {email} </div> <hr/>
                <div className = 'more-details-container'>
                    <h3> More Details </h3>
                    <div className = 'num-reviews'> Total Reviews: {numReviews} </div>
                    <div className = 'num-collection'> Movies Watched: {numMovies} </div>
                    <div className = 'num-collection'> Shows Watched: {numShows} </div>
                </div>
                <div className = 'btn-container text-center'>
                    <Button className = 'profile-btn btn-secondary' size='lg' onClick = {() => setshowEditModal(true)}>
                        Edit Information</Button>
                    <Button className = 'profile-btn btn-danger' size='lg' onClick = {openModal}>
                        Delete Account</Button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
