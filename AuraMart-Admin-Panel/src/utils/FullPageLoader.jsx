import React from "react";
import { ScaleLoader } from "react-spinners";

const FullPageLoader = ({ color = "#A59168CC", height = 50 }) => {
    return (
        <div
            style={{
                position: "fixed", // overlay above all
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent overlay
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9918, // make sure it is above sidebar/header/content
            }}
        >
            <ScaleLoader color={color} height={height} />
        </div>
    );
};

export default FullPageLoader;
