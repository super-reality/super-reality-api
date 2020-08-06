import React, { useCallback } from "react";
import {
  Switch,
  Route,
  NavLink,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./views/auth/Auth";
import { AppState } from "./redux/stores/renderer";
import { reduxAction } from "./redux/reduxAction";
import localForage from "localforage";
import Axios from "axios";
import TopNav from "./components/top-nav";
import "./App.scss";

export default function App(): JSX.Element {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  console.log(location);

  const _authenticateFromLocalStorage = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_PENDING", arg: false });
    return localForage
      .getItem<string>("com.gamegen.classroom.auth.token")
      .then((token) => {
        if (token) {
          return Axios.post("http://localhost:3000/api/v1/auth/verify", null, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000,
          })
            .then((_response) => Promise.resolve(token))
            .catch((error) => Promise.reject(error));
        } else {
          return Promise.reject();
        }
      })
      .then((token) => {
        reduxAction(dispatch, { type: "AUTH_SUCCESSFUL", arg: token });
        return Promise.resolve();
      })
      .catch((error) => {
        reduxAction(dispatch, { type: "AUTH_FAILED", arg: false });
        return Promise.reject(error);
      });
  }, [dispatch]);

  const signOut = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_INVALIDATED", arg: false });
    return localForage.removeItem("com.gamegen.classroom.auth.token");
  }, [dispatch]);

  const onSignOutClick = (event: any) => {
    event.preventDefault();
    signOut();
    history.push("/auth");
  };

  return (
    <div>
      <TopNav />
      <nav>
        {isAuthenticated ? (
          <ul className={"nav"}>
            <li>
              <NavLink exact to="/" activeClassName={"active"}>
                classroom
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" activeClassName={"active"}>
                admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/auth"
                activeClassName={"active"}
                onClick={onSignOutClick}
              >
                sign out
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className={"nav"}>
            <li>
              <NavLink to="/auth" activeClassName={"active"}>
                sign in
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
      <Switch>
        <Route path="/auth" component={Auth} />
      </Switch>
    </div>
  );
}
// <ProtectedRoute path="/admin" authPath="/auth" component={Admin} />