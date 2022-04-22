import Icon from './IconBase.js';
import React from "react";

const BackIcon = (props) => (
    <Icon width="40" height="40" viewBox="0 0 40 40" version="1.1">
        <title>Back</title>
        <g id="Web" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Learn-landing-page-(-Free-user)-Copy-47" transform="translate(-296.000000, -10.000000)">
                <g id="Back" transform="translate(296.000000, 10.000000)">
                    <rect id="Rectangle" stroke="#979797" opacity="0" x="0" y="0" width="40" height="40"></rect>
                    <g
                        id="Group-4-Copy-5"
                        transform="translate(20.500000, 20.000000) rotate(-270.000000) translate(-20.500000, -20.000000) translate(13.000000, 13.000000)"
                        stroke={props.stroke || "#000000"}
                        strokeLinecap="round"
                        strokeWidth="1.4"
                    >
                        <line
                            x1="13.2248032"
                            y1="7.17962205"
                            x2="1.62935337"
                            y2="7.17962205"
                            id="Line-2-Copy-2"
                            transform="translate(7.427078, 7.179622) scale(1, -1) rotate(90.000000) translate(-7.427078, -7.179622) "
                        ></line>
                        <polyline
                            id="Path"
                            strokeLinejoin="round"
                            transform="translate(7.427078, 7.024277) scale(1, -1) rotate(45.000000) translate(-7.427078, -7.024277) "
                            points="2.654351 11.7970041 2.65548064 2.25267924 2.65548064 2.25267924 12.1998055 2.2515496"
                        ></polyline>
                    </g>
                </g>
            </g>
        </g>
    </Icon>
);

export default BackIcon;
