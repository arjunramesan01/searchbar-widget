import React from "react";
import Icon from "./IconBase";

const HelpIcon =  ({height = 24, width = 24, fill="none", ...otherProps}) => (
    <Icon width={width} height={height} viewBox="0 0 24 24" fill={fill} {...otherProps}>
        <path d="M12 18C12.6213 18 13.125 17.4963 13.125 16.875C13.125 16.2537 12.6213 15.75 12 15.75C11.3787 15.75 10.875 16.2537 10.875 16.875C10.875 17.4963 11.3787 18 12 18Z" fill="white"/>
        <path d="M12 13.5V12.75C12.5192 12.75 13.0267 12.596 13.4584 12.3076C13.8901 12.0192 14.2265 11.6092 14.4252 11.1295C14.6239 10.6499 14.6758 10.1221 14.5746 9.61289C14.4733 9.10369 14.2233 8.63596 13.8562 8.26885C13.489 7.90173 13.0213 7.65173 12.5121 7.55044C12.0029 7.44915 11.4751 7.50114 10.9955 7.69982C10.5158 7.8985 10.1058 8.23495 9.81739 8.66663C9.52895 9.09831 9.375 9.60583 9.375 10.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="11.25" stroke="white" stroke-width="1.5"/>
    </Icon>
);

export default HelpIcon;