import React from "react";
import Icon from "./IconBase";

const KeyboardIcon =  ({height = 20, width = 20, fill="none", ...otherProps}) => (
    <Icon width={width} height={height} viewBox="0 0 20 20" fill={fill} {...otherProps}>
        <path d="M17.4609 4.375H2.53906C2.17231 4.375 1.875 4.67231 1.875 5.03906V14.9609C1.875 15.3277 2.17231 15.625 2.53906 15.625H17.4609C17.8277 15.625 18.125 15.3277 18.125 14.9609V5.03906C18.125 4.67231 17.8277 4.375 17.4609 4.375Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.375 10H15.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.375 7.5H15.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.375 12.5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 12.5H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 12.5H15.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
);

export default KeyboardIcon;