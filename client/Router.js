import {
	Redirect,
	Route,
	BrowserRouter as Router,
	Switch,
} from "react-router-dom";

import Home from "./containers/Home";
import React from "react";
import ThankYou from "./containers/ThankYou";

const Routes = (
	<Router>
		<Switch>
			<Route path="/thank-you" component={ThankYou} />
			<Route path="/" component={Home} />
			<Redirect to="/" />
		</Switch>
	</Router>
);

export default Routes;
