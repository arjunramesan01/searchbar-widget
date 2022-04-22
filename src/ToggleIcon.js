import React from "react";
import Icon from "./IconBase";

const ToggleIcon =  ({height = 36, width = 47, fill="none", ...otherProps}) => (
    <Icon width={width} height={height} viewBox="0 0 47 36" {...otherProps}>
        <rect x="3" y="4" width="44" height="26" rx="13" fill="white"/>
        <g filter="url(#filter0_d_1_1141)">
            <ellipse cx="15.2666" cy="17" rx="10.9333" ry="11.8444" fill="black"/>
        </g>
        <defs>
            <filter id="filter0_d_1_1141" x="0.333313" y="0.155579" width="33.8666" height="35.6889" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="2" dy="1"/>
                <feGaussianBlur stdDeviation="3"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_1141"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_1141" result="shape"/>
            </filter>
        </defs>
       </Icon>
);

export default ToggleIcon;