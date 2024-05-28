import * as React from 'react';
import type { SVGProps } from 'react';

const EmptyInboxIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M63 134h91c.515 0 1.017-.056 1.5-.161.483.105.985.161 1.5.161h52a7 7 0 1 0 0-14h-6a7 7 0 1 1 0-14h19a7 7 0 1 0 0-14h-22a7 7 0 1 0 0-14h-64a7 7 0 1 0 0-14H79a7 7 0 1 0 0 14H39a7 7 0 1 0 0 14h25a7 7 0 1 1 0 14H24a7 7 0 1 0 0 14h39a7 7 0 1 0 0 14m163 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M113.119 112.307A11.964 11.964 0 0 0 113 114c0 6.627 5.373 12 12 12s12-5.373 12-12c0-.575-.04-1.14-.119-1.693H166V139a3 3 0 0 1-3 3H87a3 3 0 0 1-3-3v-26.693z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M138 112c0 7.18-5.82 13-13 13s-13-5.82-13-13c0-.233.006-.464.018-.693H84l9.56-28.268A3 3 0 0 1 96.402 81h57.196c1.286 0 2.429.82 2.842 2.039l9.56 28.268h-28.018c.012.229.018.46.018.693"
      clipRule="evenodd"
    />
    <path
      fill="#F8ECFF"
      fillRule="evenodd"
      d="M136.098 112.955c0 5.547-4.969 11.045-11.098 11.045-6.129 0-11.098-5.498-11.098-11.045 0-.18.006-1.359.016-1.536H93l8.161-19.843c.352-.942 1.328-1.576 2.426-1.576h42.826c1.098 0 2.074.634 2.426 1.576L157 111.419h-20.918c.01.177.016 1.356.016 1.536"
      clipRule="evenodd"
    />
    <path
      stroke="#8448A9"
      strokeWidth={2.5}
      d="M85.25 111.512V138c0 .966.784 1.75 1.75 1.75h76a1.75 1.75 0 0 0 1.75-1.75v-26.488l-9.495-28.073a1.75 1.75 0 0 0-1.657-1.189H96.402a1.75 1.75 0 0 0-1.657 1.19z"
      clipRule="evenodd"
    />
    <path
      stroke="#8448A9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M98 111h12.745c1.876 0 1.876 1.319 1.876 2 0 6.627 5.496 12 12.276 12 6.78 0 12.276-5.373 12.276-12 0-.681 0-2 1.877-2H164m-73.426 0H93h-2.426"
    />
    <path
      stroke="#B86DE7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M150.1 58.303 139 70.756M124.1 54v16.756zM98 58.303l11.1 12.453L98 58.303"
    />
  </svg>
);
export default EmptyInboxIcon;
