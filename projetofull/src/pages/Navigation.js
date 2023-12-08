import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './css/Navigation.css';
import { SearchContext } from "../search/search";


const Navigation = ({ onPageChange, setMostrarLogin, setMostrarInsert }) => {

    const token = localStorage.getItem('token')
    const search = useContext(SearchContext)
    const [input, setInput] = useState('')

    const handleLoginClick = () => {
        onPageChange('login');
        setMostrarLogin(true);
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        onPageChange('login');
        console.log('logout concluído');
    };

    const handleInsertClick = () => {
        if (!token) {
            handleLoginClick()
        } else {
            onPageChange('insert');
            setMostrarInsert(true);
        }

    };

    const pesquisar = (event) => {
        event.preventDefault()
        if (!token) {
            handleLoginClick()
        }
        if (input.length > 3) {
            search.search(input).then((data) => {
                if (data) {
                    search.setInfo(data);
                    localStorage.setItem('myInfo', JSON.stringify(data))
                    onPageChange('busca');
                } else {
                    setInput('')
                }
            })
        } else {
            setInput('');
        }
    }

    return (
        <div className="divNav">
            <Navbar expand="lg" className="navbar">
                <Container fluid>
                    <Navbar.Brand href="#" onClick={() => onPageChange('home')}>YourAnimeList</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                            <Navbar.Brand href="#" onClick={handleInsertClick}>Inserir</Navbar.Brand>
                        </Nav>
                        <Form className="d-flex" id="placeh">
                            <Form.Control
                                type="search"
                                placeholder="Buscar"
                                className="me-2"
                                aria-label="Search"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                            />
                            <Button className="botaosearch" type="submit" onClick={pesquisar}>Buscar</Button>
                        </Form>
                        {token ? (
                            //<Navbar.Brand href="#" onClick={handleLogoutClick}>Logout</Navbar.Brand>
                            <Button className="botaologout" type="submit" onClick={handleLogoutClick}>Logout</Button>
                        ) : (
                            //<Navbar.Brand href="#" onClick={handleLoginClick}>Login</Navbar.Brand>
                            <Button className="botaologin" type="submit" onClick={handleLoginClick}>Login</Button>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation