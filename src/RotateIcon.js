import React from 'react'

const RotateIcon = ({
  height = 24,
  width = 24,
  fill = 'none',
  ...otherProps
}) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill={fill}
    xmlns='http://www.w3.org/2000/svg'
    {...otherProps}
  >
    <path
      d='M17.5188 9.34692H21.0188V5.84692'
      stroke='white'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M17.8312 17.8313C16.6777 18.9857 15.2077 19.7721 13.6072 20.091C12.0067 20.4099 10.3475 20.2469 8.83966 19.6227C7.33177 18.9984 6.0429 17.941 5.13608 16.5842C4.22926 15.2273 3.74524 13.632 3.74524 12C3.74524 10.368 4.22926 8.7727 5.13608 7.41585C6.0429 6.059 7.33177 5.00158 8.83966 4.37735C10.3475 3.75313 12.0067 3.59014 13.6072 3.90902C15.2077 4.22789 16.6777 5.0143 17.8312 6.16875L21.0187 9.34688'
      stroke='white'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
    <path
      d='M9.29 12.77C9.322 12.946 9.394 13.082 9.506 13.178C9.622 13.27 9.776 13.316 9.968 13.316C10.216 13.316 10.396 13.214 10.508 13.01C10.62 12.802 10.676 12.454 10.676 11.966C10.584 12.094 10.454 12.194 10.286 12.266C10.122 12.338 9.944 12.374 9.752 12.374C9.496 12.374 9.264 12.322 9.056 12.218C8.852 12.11 8.69 11.952 8.57 11.744C8.45 11.532 8.39 11.276 8.39 10.976C8.39 10.532 8.522 10.18 8.786 9.92C9.05 9.656 9.41 9.524 9.866 9.524C10.434 9.524 10.834 9.706 11.066 10.07C11.302 10.434 11.42 10.982 11.42 11.714C11.42 12.234 11.374 12.66 11.282 12.992C11.194 13.324 11.04 13.576 10.82 13.748C10.604 13.92 10.308 14.006 9.932 14.006C9.636 14.006 9.384 13.95 9.176 13.838C8.968 13.722 8.808 13.572 8.696 13.388C8.588 13.2 8.526 12.994 8.51 12.77H9.29ZM9.926 11.69C10.134 11.69 10.298 11.626 10.418 11.498C10.538 11.37 10.598 11.198 10.598 10.982C10.598 10.746 10.534 10.564 10.406 10.436C10.282 10.304 10.112 10.238 9.896 10.238C9.68 10.238 9.508 10.306 9.38 10.442C9.256 10.574 9.194 10.75 9.194 10.97C9.194 11.182 9.254 11.356 9.374 11.492C9.498 11.624 9.682 11.69 9.926 11.69ZM12.0439 11.756C12.0439 11.064 12.1679 10.522 12.4159 10.13C12.6679 9.738 13.0839 9.542 13.6639 9.542C14.2439 9.542 14.6579 9.738 14.9059 10.13C15.1579 10.522 15.2839 11.064 15.2839 11.756C15.2839 12.452 15.1579 12.998 14.9059 13.394C14.6579 13.79 14.2439 13.988 13.6639 13.988C13.0839 13.988 12.6679 13.79 12.4159 13.394C12.1679 12.998 12.0439 12.452 12.0439 11.756ZM14.4559 11.756C14.4559 11.46 14.4359 11.212 14.3959 11.012C14.3599 10.808 14.2839 10.642 14.1679 10.514C14.0559 10.386 13.8879 10.322 13.6639 10.322C13.4399 10.322 13.2699 10.386 13.1539 10.514C13.0419 10.642 12.9659 10.808 12.9259 11.012C12.8899 11.212 12.8719 11.46 12.8719 11.756C12.8719 12.06 12.8899 12.316 12.9259 12.524C12.9619 12.728 13.0379 12.894 13.1539 13.022C13.2699 13.146 13.4399 13.208 13.6639 13.208C13.8879 13.208 14.0579 13.146 14.1739 13.022C14.2899 12.894 14.3659 12.728 14.4019 12.524C14.4379 12.316 14.4559 12.06 14.4559 11.756Z'
      fill='white'
    />
  </svg>
)

export default RotateIcon
