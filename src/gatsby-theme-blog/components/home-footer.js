import React, { Fragment } from "react"
import { Styled, css } from "theme-ui"

const Footer = ({ socialLinks }) => (
  <footer
    css={css({
      mt: 4,
      pt: 3,
    })}
  >
    © {new Date().getFullYear()}, Powered by
    {` `}
    <a href="https://www.gatsbyjs.org" target="_blank">Gatsby</a>
    {` `}&bull;{` `}
    <a href="http://www.beian.miit.gov.cn">粤ICP备17015172号-1</a>
  </footer>
)
export default Footer
