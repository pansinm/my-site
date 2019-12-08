const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  // if (process.env.NODE_ENV === `production`) {
    const TAJA_ANALYTICS_SCRIPT = (
      <script
        type="text/javascript"
        src={`http://tajs.qq.com/stats?sId=${process.NODE_ENV.TAJS_SID}`}
        charset="UTF-8"
      />
    );
    console.log(TAJS_ANA2LYTICS_SCRIPT)
    setHeadComponents([TAJA_ANALYTICS_SCRIPT]);
  // }
  // return null;
};
