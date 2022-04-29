import './Registration.css';
import React, {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import { Button, Card, Form } from 'react-bootstrap'
import * as cons from '../../constants'

const Registration = () => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    let navigate = useNavigate()

    const handleSubmit = () => {
        if (!checkValidCredentials()) {
            alert("Please check if your credentials are correct")
            return
        }

        let req = cons.SERVER_PATH + "register"
        axios.post(req, {
            email: email,
            first_name: firstName, 
            last_name: lastName,
            password: password
        }).then((res) => {
            if (res.data.message.length > 0) alert(res.data.message)
            else {
                localStorage.setItem("name", firstName + " " + lastName)
                localStorage.setItem("session", true)
                localStorage.setItem("email", email)
                navigate("/home")
            }
        })
    }

    const checkValidCredentials = () => {
        return (password === confirmPassword) && (firstName.length < 15) && (lastName.length < 15)
        && (email.indexOf('@') !== -1) && (email.indexOf('.') !== -1)
    }

return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Card>
            <Card.Header className = 'text-center' style = {{fontSize: 25}}>
                Registration
            </Card.Header>
            <Card.Body style = {{padding: 50}}>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com"
                        onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="John"
                        onChange= {(e) => setFirstName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Smith"
                        onChange={(e) => setLastName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" 
                        onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <div className = 'text-center'>
                        <Button className = 'btn btn-primary btn-sx' onClick = {handleSubmit}> Register </Button> <br/><br/>
                        <Link to = "../login">Already have an account? Login here</Link>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    </div>
    );
}

export default Registration;
