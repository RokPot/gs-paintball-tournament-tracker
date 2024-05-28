import * as React from 'react';
import type { SVGProps } from 'react';

const NoTasksIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 250 200"
    className="fill-current"
    {...props}
  >
    <path fill="currentColor" d="M0 0h250v200H0z" />
    <path
      fill="#E4D0F1"
      fillRule="evenodd"
      d="M207 65a7 7 0 1 1 0 14h-40a7 7 0 1 1 0 14h22a7 7 0 1 1 0 14h-10.174c-4.874 0-8.826 3.134-8.826 7 0 2.577 2 4.911 6 7a7 7 0 1 1 0 14H93a7 7 0 1 1 0-14H54a7 7 0 1 1 0-14h40a7 7 0 1 0 0-14H69a7 7 0 1 1 0-14h40a7 7 0 1 1 0-14zm0 28a7 7 0 1 1 0 14 7 7 0 0 1 0-14"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      stroke="#8448A9"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="m99.942 133.192 1.49-.051v20.999c0 .475.387.86.864.86h51.84a.862.862 0 0 0 .864-.86V82.155A3.161 3.161 0 0 0 151.832 79H104.6a3.161 3.161 0 0 0-3.168 3.155v14.968l-1.49-.052c-.175-.006-.35-.009-.526-.009-9.035 0-16.416 8.062-16.416 18.07 0 10.007 7.38 18.07 16.416 18.07.176 0 .351-.003.526-.01Zm.165-6.902c-.23.019-.46.028-.691.028-5.453 0-9.773-5.055-9.773-11.186s4.32-11.186 9.773-11.186c.231 0 .462.009.691.027l1.325.106v22.105z"
      clipRule="evenodd"
    />
    <path
      stroke="#B86DE7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M147 85.182V103.5m0 5.682v4.743z"
    />
    <path
      stroke="#8448A9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M67.128 147H74m107.128 0H184m-23 0h15.428M80 147h17.454"
    />
    <path
      stroke="#B86DE7"
      strokeLinecap="round"
      strokeWidth={2.5}
      d="M128 35c-2.667 4.214-4 7.88-4 11 0 5.556 4.654 8.044 4.654 14.063 0 3.055-1.551 6.088-4.654 9.1M116 46c-.872 5.513 3 6.532 3 11.475 0 2.508-1 5.017-3 7.525M134.795 43.474c-1.321 3.42-.579 5.503 0 6.73 1.238 2.622 3.205 4.886 3.205 7.554 0 3.099-1.068 6.081-3.205 8.947"
    />
    <path fill="#F8ECFF" d="M105 84a1 1 0 0 1 1-1h19v69h-19a1 1 0 0 1-1-1z" />
  </svg>
);
export default NoTasksIcon;
