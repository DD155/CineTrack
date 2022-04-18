import './Login.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap'


const path = "http://localhost:3001/" // url for server

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = () => {
        let req = path + "login"
        axios.post(req, {
            email: email,
            password: password
        }).then((res) => {
            if (res.data.message) alert(res.data.message)
            else {
                let data = res.data[0]
                console.log(res)
                localStorage.setItem("name", data.first_name + " " + data.last_name)
                localStorage.setItem("session", true)
                navigate('/')
            }
        })
    }

    return (
        <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <Card>
                <Card.Header className = 'text-center' style = {{fontSize: 25}}>
                    Login
                </Card.Header>
                <Card.Body style = {{padding: 50}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com"
                            onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" 
                            onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <div className = 'text-center'>
                            <Button className = 'btn btn-primary btn-sx' onClick = {handleLogin}> Register </Button> <br/><br/>
                            <Link to = "../login">Already have an account? Login here</Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;
