import React from 'react';
import Icon from './IconBase.js';

const CameraIcon = ({height = 10, width = 10, fill="none", ...otherProps}) => <Icon width={width} height={height} fill={fill} viewBox="0 0 48 48" {...otherProps}>
    <path d="M39 39H9C8.20435 39 7.44129 38.6839 6.87868 38.1213C6.31607 37.5587 6 36.7956 6 36V15C6 14.2044 6.31607 13.4413 6.87868 12.8787C7.44129 12.3161 8.20435 12 9 12H15L18 7.5H30L33 12H39C39.7956 12 40.5587 12.3161 41.1213 12.8787C41.6839 13.4413 42 14.2044 42 15V36C42 36.7956 41.6839 37.5587 41.1213 38.1213C40.5587 38.6839 39.7956 39 39 39Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 31.5C27.7279 31.5 30.75 28.4779 30.75 24.75C30.75 21.0221 27.7279 18 24 18C20.2721 18 17.25 21.0221 17.25 24.75C17.25 28.4779 20.2721 31.5 24 31.5Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
</Icon>

export default CameraIcon;