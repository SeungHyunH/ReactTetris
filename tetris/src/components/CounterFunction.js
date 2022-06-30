import React from "react";
import PropTypes from "prop-types";
import "./Counter.css";
import { useSelector } from "react-redux";

const Counter = ({ onIncrement, onDecrement, onSetColor }) => {
    const number = useSelector((state) => state.numbercount.number);
    const color = useSelector((state) => state.numbercount.color);

    return (
        <div>
            <div
                className="Counter"
                onClick={onIncrement}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onDecrement();
                }}
                onDoubleClick={onSetColor}
                style={{ backgroundColor: color }}
            >
                {number}
            </div>
        </div>
    );
};

Counter.propTypes = {
    number: PropTypes.number,
    color: PropTypes.string,
    onIncrement: PropTypes.func,
    onDecrement: PropTypes.func,
    onSetColor: PropTypes.func,
};

Counter.defaultProps = {
    number: 0,
    color: "black",
    onIncrement: () => console.warn("onIncrement not defined"),
    onDecrement: () => console.warn("onDecrement not defined"),
    onSetColor: () => console.warn("onSetColor not defined"),
};

export default Counter;