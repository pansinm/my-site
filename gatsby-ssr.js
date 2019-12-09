import React from 'react';

// 插入站点统计代码
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  if (process.env.NODE_ENV === 'production') {
    const headComponents = getHeadComponents();
    headComponents.push(
      <script
        type="text/javascript"
        src={`http://tajs.qq.com/stats?sId=${process.env.TAJS_SID}`}
        charset="UTF-8"
      />
    )
    replaceHeadComponents(headComponents);
  }
};
