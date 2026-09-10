import React from "react";

function SkeletonCards({ count = 8, cardWidth = "14rem" }) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={`skeleton-${idx}`}
                    className="card mr-2 mb-3 sneaker-card skeleton-card"
                    style={{ width: cardWidth }}
                    aria-hidden="true"
                >
                    <div className="card-body d-flex flex-column sneaker-card-body">
                        <div className="skeleton-pill mb-2" />
                        <div className="skeleton-image mb-3" />
                        <div className="skeleton-line skeleton-line-title mb-2" />
                        <div className="skeleton-line mb-2" />
                        <div className="skeleton-line mb-2" />
                        <div className="skeleton-line skeleton-line-short mb-3" />
                        <div className="skeleton-button mt-auto mx-auto" />
                    </div>
                </div>
            ))}
        </>
    );
}

export default SkeletonCards;
