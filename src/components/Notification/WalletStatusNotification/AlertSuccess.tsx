import * as React from 'react';

const AlertSuccess = ({ width, height }: { width: string | number; height: string | number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 0C8.5204 0 0 8.5204 0 19C0 29.4796 8.5204 38 19 38C29.4796 38 38 29.4796 38 19C38 8.5204 29.4796 0 19 0ZM28.6 14.7592L18.4408 26.32C18.0814 26.72 17.6002 26.9606 17.0814 26.9606H17.0018C16.5221 26.9606 16.0424 26.7606 15.6814 26.4013L9.47983 20.1593C8.75951 19.439 8.75951 18.239 9.47983 17.5186C10.2002 16.7983 11.4002 16.7983 12.1205 17.5186L16.9613 22.3594L25.8005 12.2798C26.4802 11.4798 27.6802 11.4392 28.4411 12.1205C29.2411 12.8001 29.3203 13.9592 28.6 14.7592Z"
        fill="#23C1AA"
      />
    </svg>
  );
};

export default AlertSuccess;
