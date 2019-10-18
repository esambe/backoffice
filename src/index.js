// import external modules
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// import internal(own) modules
import createApplicationStore  from "./store/store_config";
import ReduxToastr from 'react-redux-toastr'

import "./index.scss";

import "react-perfect-scrollbar/dist/css/styles.css";
// import internal(own) modules
import ApplicationRoutesContainer from "./routes";

const store = createApplicationStore()
window.currentCtx = {}

ReactDOM.render(
   <Provider store={store}>
        <div className="match-parent">
            <ApplicationRoutesContainer />
            <ReduxToastr
                timeOut={4000}
                newestOnTop={false}
                preventDuplicates
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                closeOnToastrClick/>
        </div>
   </Provider>,
   document.getElementById("root")
);
