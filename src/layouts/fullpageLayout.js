import React from "react";
import templateConfig from "../templateConfig";
import classnames from "classnames";
import bgImage from "../assets/img/container_img.png"

const FullPageLayout = ({ children,  ...rest }) => {
   return (
      <div
         className={classnames("login-layout wrapper ", {
            "layout-dark": templateConfig.layoutDark
         })}
      >
         <main className="main text-muted">{children}</main>
      </div>
   );
};

export const FullPageOverlayLayout = ({ children, imgUrl, ...rest }) => {
   return (
      <div
         className={classnames("login-layout wrapper background-container", {
            "layout-dark": templateConfig.layoutDark
         })}
         style={{ backgroundImage: "url('" + ( imgUrl?imgUrl:bgImage ) + "')" }}
      >
         <div className="background-container"></div>
         <main className="main text-muted child-overlay">{children}</main>
      </div>
   );
};

export default FullPageLayout;
