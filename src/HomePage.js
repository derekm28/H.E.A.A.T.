import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel'
import { Card, Button } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

function HomePage(props) {

    const url = "https://api.thesneakerdatabase.com/v1/sneakers?limit=100";

    const [sneakers, setSneakers] = useState(null);
    const [saved, setSaved] = useState();

    useEffect(() => {
        axios.get(url).then(res => {
            setSneakers(res.data.results)
        });
    }, [url])

    function SneakerDisplay() {
        return (
            <div className="row justify-content-center ">
                {sneakers
                    ? sneakers.map((s, idx) => (
                        <Card
                            key={s.id}
                            className="mr-2"
                            title={s.title}
                            brand={s.brand}
                            colorway={s.colorway}
                            style={{ width: "18rem" }}
                            shoe={s.shoe}
                            name={s.name}>
                            <Card.Body>
                                <Card.Img variant="top" src={s.media.smallImageUrl} />
                                <Card.Title>{s.title}</Card.Title>
                                <Card.Text>
                                    <div>{s.colorway}</div>
                                    <div>Release Date: {s.releaseDate}</div>
                                    <div>Retail Price: ${s.retailPrice}</div>
                                    {/* <Button variant="primary" className='btn btn-danger font-weight-bold text-uppercase'
                                        //onClick={handleSave}
                                        disabled={saved}>
                                        {saved ? 'Saved' : 'Save'}</Button> */}
                                     <Button variant="primary">Save</Button>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                    : null}
            </div>
        );
    }
    return (
        <div className='HomePage'>
            <Jumbotron fluid>
                <Container>
                    <h1>Heat</h1>
                    <p>
                        The source for new heat dropping soon.
                    </p>
                </Container>
            </Jumbotron>
            <div className='HomePage-cards'>
                <Carousel>
                    <Carousel.Item interval={3000}>
                        <img
                            className="mx-auto d-block w-50"
                            src="https://images.stockx.com/images/Nike-Lebron-7-Los-Angeles-Dodgers.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1613645246"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3></h3>
                            <p></p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={3000}>
                        <img
                            className="mx-auto d-block w-50"
                            src="https://images.stockx.com/images/Air-Jordan-4-Retro-White-Oreo-2021-GS.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1614141824"
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h3></h3>
                            <p></p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="mx-auto d-block w-50"
                            src="https://images.stockx.com/images/adidas-Yeezy-450-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1615564111"
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h3></h3>
                            <p></p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div>
                <SneakerDisplay />
            </div>
        </div>

    );


}

export default HomePage;
