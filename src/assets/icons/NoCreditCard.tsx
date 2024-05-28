import * as React from 'react';
import type { SVGProps } from 'react';

const NoCreditCardIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m69.953 70.518 83.024-13.292a3 3 0 0 1 3.437 2.488l.001.01 8.122 51.832a3 3 0 0 1-2.489 3.427l-83.025 13.291a3 3 0 0 1-3.437-2.488l-.001-.01-8.122-51.832a3 3 0 0 1 2.49-3.426"
      clipRule="evenodd"
    />
    <path
      stroke="#8448A9"
      strokeLinecap="round"
      strokeWidth={2.5}
      d="m83.345 127.423-3.183.525c-2.187.36-4.24-1.192-4.587-3.467L68.05 75.039c-.346-2.275 1.145-4.412 3.332-4.773l80.176-13.214c2.187-.36 4.24 1.192 4.587 3.468l.807 5.3m.571 3.756.477 3.133"
    />
    <path
      fill="#F8ECFF"
      fillRule="evenodd"
      d="m73.977 72.792 75.76-11.831a3 3 0 0 1 3.425 2.488l7.36 45.819a3 3 0 0 1-2.486 3.438l-.013.002-75.76 11.831a3 3 0 0 1-3.425-2.488l-7.36-45.82a3 3 0 0 1 2.486-3.437z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      stroke="#8448A9"
      strokeWidth={2.5}
      d="M170.75 77.25h-78.5a4 4 0 0 0-4 4v48.5a4 4 0 0 0 4 4h78.5a4 4 0 0 0 4-4v-48.5a4 4 0 0 0-4-4Z"
    />
    <path fill="#F8ECFF" d="M173.5 89h-84v14h84z" />
    <path
      stroke="#8448A9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M103.289 89h-7.196m78.078 0h-65.84zm-6 13h-78.84zm-43.109 19H96.755z"
    />
  </svg>
);
export default NoCreditCardIcon;
