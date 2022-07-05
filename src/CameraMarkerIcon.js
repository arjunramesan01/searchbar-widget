import React from 'react'

const CameraMarkerIcon = ({
  height = 124,
  width = 313,
  fill = 'none',
  ...otherProps
}) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 313 124'
    fill={fill}
    xmlns='http://www.w3.org/2000/svg'
    {...otherProps}
  >
    <path
      d='M2 23.3333V12C2 6.47716 6.47715 2 12 2H17.1193'
      stroke='white'
      stroke-width='3'
      stroke-linecap='round'
    />
    <path
      d='M17.1193 122L12 122C6.47715 122 2 117.523 2 112L2 100.667'
      stroke='white'
      stroke-width='3'
      stroke-linecap='round'
    />
    <path
      d='M311 23.3333V12C311 6.47716 306.523 2 301 2H295.881'
      stroke='white'
      stroke-width='3'
      stroke-linecap='round'
    />
    <path
      d='M295.881 122L301 122C306.523 122 311 117.523 311 112L311 100.667'
      stroke='white'
      stroke-width='3'
      stroke-linecap='round'
    />
  </svg>
)

export default CameraMarkerIcon
