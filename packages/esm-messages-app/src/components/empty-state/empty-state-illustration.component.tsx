import React from "react";

const EmptyStateIllustration = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={100}
    height={100}
    viewBox="0 0 2048 2048"
    style={{
      shapeRendering: "geometricPrecision",
      textRendering: "geometricPrecision",
      imageRendering: "optimizeQuality",
      fillRule: "evenodd",
      clipRule: "evenodd",
    }}
    {...props}
  >
    <defs>
      <style>
        {".fil0,.fil1{fill:#858585;fill-rule:nonzero}.fil1{fill:#858585}"}
      </style>
    </defs>
    <g id="Layer_x0020_1">
      <path
        className="fil0"
        d="M303.999 914.955v519.372h192.142c13.254 0 24 10.746 24 24 0 3.452-.73 6.736-2.043 9.702l-73.93 222.526 279.187-250.032-.065-.074a23.905 23.905 0 0 1 16.01-6.119v-.002h597.409V914.956H303.999zm-48 543.372V890.955c0-13.254 10.746-24 24-24h1080.71c13.254 0 24 10.746 24 24v567.372c0 13.254-10.746 24-24 24h-612.38L410.76 1784.646c-6.202 6.685-15.96 9.524-25.178 6.462-12.578-4.179-19.387-17.765-15.209-30.344l.1.033 92.515-278.47h-182.99c-13.254 0-24-10.746-24-24z"
      />
      <path
        className="fil1"
        d="M403.029 1042.03h834.651v48H403.029zM403.029 1265.49h834.651v48H403.029z"
      />
      <path
        className="fil0"
        d="M1792 279.668v489.833c0 13.254-10.746 24-24 24h-153.45l78.44 236.105.099-.033c4.177 12.579-2.632 26.165-15.21 30.342-9.218 3.062-18.976.224-25.177-6.461L1362.441 793.5H834.985c-13.254 0-24-10.746-24-24V279.668c0-13.255 10.746-24 24-24H1768c13.254 0 24 10.745 24 24zm-48 465.833V303.668H858.985v441.833h512.484v.002a23.905 23.905 0 0 1 16.011 6.12l-.065.073 231.878 207.666-59.852-180.161a23.898 23.898 0 0 1-2.044-9.7c0-13.255 10.746-24 24-24H1744z"
      />
      <path
        className="fil1"
        d="M1661.78 454.819H941.2v-48h720.58zM1661.78 647.737H941.2v-48h720.58z"
      />
    </g>
    <path
      style={{
        fill: "none",
      }}
      d="M0 0h2048v2048H0z"
    />
  </svg>
);
export default EmptyStateIllustration;
