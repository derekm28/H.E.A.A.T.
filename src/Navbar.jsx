import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

function NavBar() {
    const history = useHistory();
    const [query, setQuery] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            return;
        }
        history.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }

    function navBar() {
        return (
            <Navbar fixed="top" bg="light" variant="light">
                <Navbar.Brand href="/">Heaat</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>

                    <Nav.Link href="/shoes/nike">Nike</Nav.Link>

                    <Nav.Link href="/shoes/jordan">Jordan</Nav.Link>

                    <Nav.Link href="/shoes/yeezy">Yeezy</Nav.Link>

                    <Nav.Link href="/shoes/off-white">OFF WHITE</Nav.Link>

                    <Nav.Link href="/mens">{"Men's"}</Nav.Link>

                    <Nav.Link href="/womens">{"Women's"}</Nav.Link>

                    <NavDropdown title="Designer" id="Dropdown">
                        <NavDropdown.Item href="/shoes/balenciaga">
                            Balenciaga
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/shoes/louis-vuitton">
                            Louis Vuitton
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/shoes/prada">
                            Prada
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/shoes/gucci">
                            Gucci
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/shoes/dior">
                            Dior
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/shoes/chanel">
                            Chanel
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Form
                    inline
                    className="navbar-search"
                    onSubmit={handleSubmit}
                >
                    <FormControl
                        type="search"
                        placeholder="Search sneakers"
                        className="mr-2"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        aria-label="Search sneakers"
                    />
                    <Button variant="outline-dark" type="submit">
                        Search
                    </Button>
                </Form>
            </Navbar>
        );
    }

    return <nav className="NavBar navbar navbar-expand-md">{navBar()}</nav>;
}

export default NavBar;
