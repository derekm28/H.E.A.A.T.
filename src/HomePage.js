import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import { Card, Button } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ModalCard from "./Modal";

function HomePage() {
    const [sneakers, setSneakers] = useState(null);
    const [sneakerModalData, setSneakerModalData] = useState({});
    const [showModal, setShowModal] = useState(false);

    const home = {
        method: "GET",
        url: "https://v1-sneakers.p.rapidapi.com/v1/sneakers",
        params: { limit: "100" },
        headers: {
            "x-rapidapi-key":
                "d35e6f2cf6msh582d393a4408760p1fd4ddjsna38953b14404",
            "x-rapidapi-host": "v1-sneakers.p.rapidapi.com",
        },
    };
    useEffect(() => {
        async function getSneakers() {
            axios.request(home).then(res => {
                const { results } = res.data;
                setSneakers(
                    results.filter(s => {
                        const { smallImageUrl } = s.media;
                        return smallImageUrl && smallImageUrl !== "";
                    }),
                );
            });
        }
        getSneakers();
    });

    function SneakerDisplay() {
        return (
            <div className="row justify-content-center ">
                {sneakers
                    ? sneakers.map(s => (
                          <Card
                              key={s.id}
                              className="mr-2"
                              title={s.title}
                              brand={s.brand}
                              colorway={s.colorway}
                              style={{ width: "14rem" }}
                              shoe={s.shoe}
                              name={s.name}
                              onClick={setShowModal}
                          >
                              <Card.Body>
                                  <Card.Img
                                      variant="top"
                                      src={s.media.smallImageUrl}
                                  />
                                  <Card.Title>{s.title}</Card.Title>
                                  <Card.Text>
                                      <div>{s.colorway}</div>
                                      <div>Release Date: {s.releaseDate}</div>
                                      <div>Retail Price: ${s.retailPrice}</div>
                                      <Button
                                          variant="primary"
                                          onClick={() => {
                                              setSneakerModalData(s);
                                              setShowModal();
                                          }}
                                      >
                                          Details
                                      </Button>
                                  </Card.Text>
                              </Card.Body>
                          </Card>
                      ))
                    : null}
            </div>
        );
    }
    return (
        <div className="HomePage">
            <Jumbotron className="row justify-content-center">
                <div>
                    <Container>
                        <h1>H.E.A.A.T.</h1>
                        <p>High Expectations At All Times.</p>
                    </Container>
                </div>
            </Jumbotron>
            <div className="HomePage-cards">
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
                    <Carousel.Item interval={3000}>
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
                <ModalCard
                    sneaker={sneakerModalData}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </div>
        </div>
    );
}

export default HomePage;
