import React from 'react';
import Icon from './IconBase.js';

const CrossIcon = ({height = 10, width = 10, fill="#000", ...otherProps}) => (
    <Icon width={width} height={height} viewBox="0 0 10 10" {...otherProps}>
        <path d="M4.898 4.014L1.068.184a.624.624 0 1 0-.884.884l3.83 3.83-3.83 3.83a.624.624 0 1 0 .884.884l3.83-3.83 3.83 3.83a.624.624 0 1 0 .884-.884l-3.83-3.83 3.83-3.83a.624.624 0 1 0-.884-.884l-3.83 3.83z" fill={fill} fillRule="evenodd" />
    </Icon>
);

export default CrossIcon;