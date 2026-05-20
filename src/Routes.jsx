import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ShoePage from "./ShoePage";
import MensPage from "./MensPage";
import WomensPage from "./WomensPage";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";

/**Site-wide routes
 *
 * Parts of site should only be visitable when logged in. Those routes are wrapped by <PrivateRoute>, which is an authorization component
 *
 * Visiting a non-existant route redirects to the homepage
 */

function Routes() {
    return (
        <div className="Routes">
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>

                <Route exact path="/shoes/:shoeBrand">
                    <ShoePage />
                </Route>

                <Route exact path="/mens">
                    <MensPage />
                </Route>

                <Route exact path="/womens">
                    <WomensPage />
                </Route>

                <Route exact path="/search">
                    <SearchPage />
                </Route>

                <Redirect exact to="/" />
            </Switch>
        </div>
    );
}

export default Routes;
