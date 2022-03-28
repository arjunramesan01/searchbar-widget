import React from "react";
import Icon from "./IconBase";

const FlashIcon =  ({height = 10, width = 10, fill="#000", ...otherProps}) => (
    <Icon width={width} height={height} viewBox="0 0 18 24" {...otherProps}>
        <path d="M6 22.5L7.5 15L1.5 12.75L12 1.5L10.5 9L16.5 11.25L6 22.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
);

export default FlashIcon;