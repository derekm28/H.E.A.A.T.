import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Card, Button } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ModalCard from "./Modal";
import SkeletonCards from "./SkeletonCards";
import {
    filterSneakersWithWorkingThumbnails,
    getThumbnailUrl,
} from "./sneakerMedia";
import { getHeatScoreData } from "./heatScore";
import { getSneakers as fetchSneakers } from "./sneakerApi";

function HomePage() {
    const [sneakers, setSneakers] = useState(null);
    const [sneakerModalData, setSneakerModalData] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getSneakers() {
            const results = await fetchSneakers();
            const filteredSneakers = await filterSneakersWithWorkingThumbnails(results);
            setSneakers(filteredSneakers);
        }
        getSneakers().catch(() => setSneakers([]));
    }, []);

    function SneakerDisplay() {
        return (
            <div className="row justify-content-center ">
                {sneakers === null ? (
                    <SkeletonCards cardWidth="14rem" />
                ) : sneakers.length
                    ? sneakers.map(s => {
                          const heat = getHeatScoreData(s);
                          return (
                              <Card
                                  key={s.id}
                                  className="mr-2 mb-3 sneaker-card"
                                  title={s.title}
                                  brand={s.brand}
                                  colorway={s.colorway}
                                  style={{ width: "14rem" }}
                                  shoe={s.shoe}
                                  name={s.name}
                              >
                                  <Card.Body className="d-flex flex-column sneaker-card-body">
                                      <div
                                          className={`heat-badge heat-${heat.tierKey}`}
                                      >
                                          Heat {heat.score}
                                      </div>
                                      <Card.Img
                                          variant="top"
                                          src={getThumbnailUrl(s)}
                                          className="sneaker-card-image"
                                      />
                                      <Card.Title>{s.title}</Card.Title>
                                      <Card.Text>
                                          <div>{s.colorway}</div>
                                          <div>Release Date: {s.releaseDate}</div>
                                          <div>Retail Price: ${s.retailPrice}</div>
                                      </Card.Text>
                                      <Button
                                          className="d-block mx-auto mt-auto"
                                          variant="primary"
                                          onClick={() => {
                                              setSneakerModalData(s);
                                              setShowModal(true);
                                          }}
                                      >
                                          Details
                                      </Button>
                                  </Card.Body>
                              </Card>
                          );
                      })
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
