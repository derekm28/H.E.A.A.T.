import Modal from "react-bootstrap/Modal";
import React from "react";
import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";

function ModalCard(props) {
    const { sneaker } = props;
    console.log(props);
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
                        text="center"
                    >
                        <div>{sneaker.title}</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col xs={6} md={6}>
                        <Image src={sneaker.media.smallImageUrl} />
                    </Col>
                    Shoe Details:
                    <div>{sneaker.shoe}</div>
                    <div>{sneaker.name}</div>
                    <div>Release Date: {sneaker.releaseDate}</div>
                    <div>Retail Price: ${sneaker.retailPrice}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Notify me when close to release date!!</Button>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalCard;
