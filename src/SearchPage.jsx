import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
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
import { trackEvent } from "./analytics";

function SearchPage() {
    const location = useLocation();
    const query = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return (params.get("q") || "").trim();
    }, [location.search]);
    const ref = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return (params.get("ref") || "").trim();
    }, [location.search]);
    const [sneakers, setSneakers] = useState(null);
    const [sneakerModalData, setSneakerModalData] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function runSearch() {
            if (!query) {
                setSneakers([]);
                return;
            }

            setSneakers(null);
            try {
                const response = await axios.get(
                    "https://v1-sneakers.p.rapidapi.com/v1/sneakers",
                    {
                        params: { limit: "100", name: query },
                        headers: {
                            "x-rapidapi-key":
                                "d35e6f2cf6msh582d393a4408760p1fd4ddjsna38953b14404",
                            "x-rapidapi-host": "v1-sneakers.p.rapidapi.com",
                        },
                    },
                );
                let { results } = response.data;

                if (!results || results.length === 0) {
                    const fallbackResponse = await axios.get(
                        "https://v1-sneakers.p.rapidapi.com/v1/sneakers",
                        {
                            params: { limit: "100" },
                            headers: {
                                "x-rapidapi-key":
                                    "d35e6f2cf6msh582d393a4408760p1fd4ddjsna38953b14404",
                                "x-rapidapi-host": "v1-sneakers.p.rapidapi.com",
                            },
                        },
                    );
                    results = fallbackResponse.data?.results || [];
                }

                const normalizedQuery = query.toLowerCase();
                const locallyMatched = results.filter(sneaker => {
                    const fields = [
                        sneaker?.title,
                        sneaker?.brand,
                        sneaker?.shoe,
                        sneaker?.colorway,
                        sneaker?.styleId,
                        sneaker?.name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();
                    return fields.includes(normalizedQuery);
                });

                const filteredSneakers =
                    await filterSneakersWithWorkingThumbnails(locallyMatched);
                if (!cancelled) {
                    setSneakers(filteredSneakers);
                }
            } catch (_error) {
                if (!cancelled) {
                    setSneakers([]);
                }
            }
        }

        runSearch();

        return () => {
            cancelled = true;
        };
    }, [query]);

    useEffect(() => {
        if (ref === "share" && query) {
            trackEvent("share_opened", { query });
        }
    }, [ref, query]);

    function SneakerDisplay() {
        if (!query) {
            return (
                <div className="text-center mt-4">
                    Enter a search term to find sneakers.
                </div>
            );
        }

        return (
            <div className="row justify-content-center ">
                {sneakers === null ? (
                    <SkeletonCards cardWidth="14rem" />
                ) : sneakers.length ? (
                    sneakers.map(s => {
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
                                    <div className={`heat-badge heat-${heat.tierKey}`}>
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
                ) : (
                    <div className="text-center mt-4">
                        No results found for “{query}”.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="SearchPage">
            <Jumbotron className="row justify-content-center">
                <div>
                    <Container>
                        <h1>Search</h1>
                        <p>
                            {query
                                ? `Results for “${query}”`
                                : "Search across all sneakers"}
                        </p>
                    </Container>
                </div>
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

export default SearchPage;
