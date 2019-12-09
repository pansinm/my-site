import React from 'react';

// 插入站点统计代码
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }, options) => {
  console.log(options);
  if (process.env.NODE_ENV === 'production') {
    const headComponents = getHeadComponents();
    headComponents.push(
      <script
        type="text/javascript"
        src={`https://tajs.qq.com/stats?sId=${options.sid}`}
        charset="UTF-8"
      />
    )
    replaceHeadComponents(headComponents);
  }
};
