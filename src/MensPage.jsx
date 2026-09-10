import React, { useState, useEffect } from "react";
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

function MensPage() {
    const [sneakers, setSneakers] = useState(null);
    const [sneakerModalData, setSneakerModalData] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getSneakers() {
            try {
                const results = await fetchSneakers({ gender: "men" });
                const filteredSneakers =
                    await filterSneakersWithWorkingThumbnails(results);
                setSneakers(filteredSneakers);
            } catch (e) {
                console.log("Theres an error somewhere");
            }
        }
        getSneakers();
    }, []);

    function SneakerDisplay() {
        return (
            <div className="row justify-content-center ">
                {sneakers === null ? (
                    <SkeletonCards count={6} cardWidth="18rem" />
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
                                  style={{ width: "18rem" }}
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
        <div className="FrontPage">
            <Jumbotron fluid>
                <Container>
                    <h1>{"Men's"}</h1>
                </Container>
            </Jumbotron>
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

export default MensPage;
