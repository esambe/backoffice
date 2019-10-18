import React from "react";
const Footer = props => (
   <footer>
      <div className="container-fluid">
         <p className="text-center">
            © {new Date().getFullYear()+ " "}
            <a
               href="https://www.montaxii.com"
               rel="noopener noreferrer"
               target="_blank"
            >
               MonTaxi
            </a>
         </p>
      </div>
   </footer>
);

export default Footer;
