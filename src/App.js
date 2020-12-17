import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createContext, useState } from "react";
import Auth from "./components/Auth/Auth";
import CreateEmployee from "./components/Home/Admin/CreateEmployee/CreateEmployee";
import Users from "./components/Home/Users/Users";
import Staffs from "./components/Home/Admin/Staffs/Staffs";
import AdminRoute from "./components/PrivateRoutes/AdminRoute/AdminRoute";
import StaffRoute from "./components/PrivateRoutes/StaffRoute/StaffRoute";
import NotFound from "./components/NotFound/NotFound";
import UserHome from "./components/Home/UserHome/UserHome";
import UserRoute from "./components/PrivateRoutes/UserRoute/UserRoute";
import ManagePosts from "./components/Home/ManagePosts/ManagePosts";
import PostDetails from "./components/Home/UserHome/PostDetails/PostDetails";

export const LoggedInUserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(sessionStorage.getItem("loggedInUser"))
  );

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Auth />
          </Route>

          <Route path="/auth">
            <Auth />
          </Route>

          <UserRoute path="/userHome">
            <UserHome />
          </UserRoute>

          <UserRoute path="/postDetails/:id">
            <PostDetails />
          </UserRoute>

          <StaffRoute path="/managePosts">
            <ManagePosts />
          </StaffRoute>

          <StaffRoute path="/users">
            <Users />
          </StaffRoute>

          <AdminRoute path="/createEmployee">
            <CreateEmployee />
          </AdminRoute>

          <AdminRoute path="/staffs">
            <Staffs />
          </AdminRoute>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </LoggedInUserContext.Provider>
  );
}

export default App;
