import Modal from "react-bootstrap/Modal";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { getThumbnailUrl } from "./sneakerMedia";
import { getHeatScoreData } from "./heatScore";
import { trackEvent } from "./analytics";

function ModalCard(props) {
    const { sneaker } = props;
    const thumbnailUrl = getThumbnailUrl(sneaker);
    const heat = getHeatScoreData(sneaker || {});
    const [shareStatus, setShareStatus] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [history, setHistory] = useState("");
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const stockxUrl = sneaker?.links?.stockX;
    const goatUrl = sneaker?.links?.goat;
    const flightClubUrl = sneaker?.links?.flightClub;
    const stadiumGoodsUrl = sneaker?.links?.stadiumGoods;
    const searchQuery = encodeURIComponent(
        [sneaker?.brand, sneaker?.title, sneaker?.colorway]
            .filter(Boolean)
            .join(" "),
    );
    const stockxSearchUrl = searchQuery
        ? `https://stockx.com/search?s=${searchQuery}`
        : "";
    const googleSearchUrl = searchQuery
        ? `https://www.google.com/search?q=${searchQuery}%20sneakers`
        : "";

    const shareUrl = useMemo(() => {
        if (!searchQuery || typeof window === "undefined") {
            return "";
        }
        const url = new URL("/search", window.location.origin);
        url.searchParams.set("q", decodeURIComponent(searchQuery));
        url.searchParams.set("ref", "share");
        return url.toString();
    }, [searchQuery]);

    const shareText = useMemo(() => {
        const title = sneaker?.title || "Sneaker";
        const heatLabel = heat?.score ? ` (Heat ${heat.score})` : "";
        return `Check out ${title}${heatLabel} on H.E.A.A.T.: ${shareUrl}`;
    }, [sneaker?.title, heat?.score, shareUrl]);

    useEffect(() => {
        if (props.show) {
            setShareStatus(null);
            setActiveTab("details");
            setHistory("");
            setHistoryError("");
            setHistoryLoading(false);
        }
    }, [props.show, sneaker?.id]);

    async function handleShare() {
        if (!shareUrl) {
            return;
        }
        trackEvent("share_clicked", {
            sneakerId: sneaker?.id,
            sneakerTitle: sneaker?.title,
        });
        setShareStatus(null);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: sneaker?.title || "H.E.A.A.T.",
                    text: shareText,
                    url: shareUrl,
                });
                setShareStatus("shared");
                trackEvent("share_success", {
                    method: "native",
                    sneakerId: sneaker?.id,
                });
                return;
            } catch (_error) {
                setShareStatus("cancelled");
            }
        }

        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(shareText);
                setShareStatus("copied");
                trackEvent("share_success", {
                    method: "clipboard",
                    sneakerId: sneaker?.id,
                });
            } catch (_error) {
                setShareStatus("failed");
            }
        }
    }

    async function loadHistory() {
        setActiveTab("history");

        if(history || historyLoading){
            return;
        }

        setHistoryLoading(true);
        setHistoryError("");

        trackEvent("history_tab_opened", {
            sneakerId: sneaker?.id,
            sneakerTitle: sneaker?.title,
        });

        try {
            const response = await fetch("/api/shoe-history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product: {
                        title: sneaker?.title,
                        brand: sneaker?.brand,
                        model: sneaker?.shoe,
                        colorway: sneaker?.colorway,
                        releaseDate: sneaker?.releaseDate,
                        retailPrice: sneaker?.retailPrice,
                        styleId: sneaker?.styleId,
                        description: sneaker?.description,
                    },
                }),
            })

            const body = await response.json();

            if(!response.ok) {
                throw new Error(body.error || "Unable to generate history");
            }

            setHistory(body.summary);
            trackEvent("history_loaded", {
                sneakerId: sneaker?.id,
            });
        } catch (_error) {
            setHistoryError("History is unavailable right now");
            trackEvent("history_error", {
                sneakerId: sneaker?.id,
            });
        }finally{
            setHistoryLoading(false);
        }
    }

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                    >
                        <div>{sneaker?.title || "Shoe Details"}</div>
                        <div className={`heat-badge heat-${heat.tierKey} mt-2`}>
                            Heat {heat.score} - {heat.tierLabel}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt={sneaker?.title || "Sneaker thumbnail"}
                            fluid
                            rounded
                            className="d-block mx-auto mb-3"
                            style={{ maxHeight: "260px" }}
                        />
                    ) : null}
                    <div
                        className="nav nav-tabs mb-3"
                        role="tablist"
                        aria-label="Sneaker information"
                    >
                        <button
                            type="button"
                            className={`nav-link ${
                                activeTab === "details" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("details")}
                            role="tab"
                            aria-selected={activeTab === "details"}
                        >
                            Details
                        </button>
                        <button
                            type="button"
                            className={`nav-link ${
                                activeTab === "history" ? "active" : ""
                            }`}
                            onClick={loadHistory}
                            role="tab"
                            aria-selected={activeTab === "history"}
                            >
                                History
                        </button>
                    </div>
                    {activeTab === "details" ? (
                        <>
                    <div className="modal-details-grid">
                        <div>
                            <strong>Brand:</strong>
                            <span>{sneaker?.brand || "N/A"}</span>
                        </div>
                        <div>
                            <strong>Silhouette:</strong>
                            <span>{sneaker?.shoe || "N/A"}</span>
                        </div>
                        <div>
                            <strong>Colorway:</strong>
                            <span>{sneaker?.colorway || "N/A"}</span>
                        </div>
                        <div>
                            <strong>Release Date:</strong>
                            <span>{sneaker?.releaseDate || "N/A"}</span>
                        </div>
                        <div>
                            <strong>Retail Price:</strong>
                            <span>
                                {sneaker?.retailPrice
                                    ? `$${sneaker.retailPrice}`
                                    : "N/A"}
                            </span>
                        </div>
                        <div>
                            <strong>SKU:</strong>
                            <span>{sneaker?.styleId || "N/A"}</span>
                        </div>
                    </div>
                    {stockxUrl ||
                    goatUrl ||
                    flightClubUrl ||
                    stadiumGoodsUrl ||
                    stockxSearchUrl ||
                    googleSearchUrl ? (
                        <div className="text-center mt-3">
                            {stockxUrl ? (
                                <a
                                    href={stockxUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-dark mr-2 mb-2"
                                >
                                    Buy on StockX
                                </a>
                            ) : null}
                            {goatUrl ? (
                                <a
                                    href={goatUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-dark mr-2 mb-2"
                                >
                                    Buy on GOAT
                                </a>
                            ) : null}
                            {flightClubUrl ? (
                                <a
                                    href={flightClubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-dark mr-2 mb-2"
                                >
                                    Buy on Flight Club
                                </a>
                            ) : null}
                            {stadiumGoodsUrl ? (
                                <a
                                    href={stadiumGoodsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-dark mb-2 mr-2"
                                >
                                    Buy on Stadium Goods
                                </a>
                            ) : null}
                            {!stockxUrl &&
                            !goatUrl &&
                            !flightClubUrl &&
                            !stadiumGoodsUrl ? (
                                <>
                                    {stockxSearchUrl ? (
                                        <a
                                            href={stockxSearchUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline-dark mr-2 mb-2"
                                        >
                                            Search StockX
                                        </a>
                                    ) : null}
                                    {googleSearchUrl ? (
                                        <a
                                            href={googleSearchUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline-dark mb-2"
                                        >
                                            Search Google
                                        </a>
                                    ) : null}
                                </>
                            ) : null}
                        </div>
                    ) : null}
                    </> 
                    ):(
                        <div aria-live="polite">
                            {historyLoading ? (
                                <p>Generating history...</p>
                            ) : historyError ? (
                                <div className="text-danger">
                                    <p>{historyError}</p>
                                    <Button
                                        variant="outline-primary"
                                        onClick={loadHistory}
                                    >
                                        Try again
                                    </Button>
                                </div>
                            ) : history ? (
                                <>
                                    <p>{history}</p>
                                    <small className="text-muted">
                                        Generated from available product data.
                                    </small>
                                </>
                            ) : (
                                <p>Select History to generate a summary.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="mr-auto">
                        {shareStatus === "copied" ? (
                            <small className="text-success">
                                Link copied to clipboard
                            </small>
                        ) : null}
                        {shareStatus === "shared" ? (
                            <small className="text-success">
                                Shared successfully
                            </small>
                        ) : null}
                        {shareStatus === "failed" ? (
                            <small className="text-danger">
                                Unable to copy link
                            </small>
                        ) : null}
                    </div>
                    <Button
                        variant="outline-primary"
                        onClick={handleShare}
                        disabled={!shareUrl}
                    >
                        Share
                    </Button>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalCard;
