import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes from "./routes/routes";
import { useAuthState } from "./context";
import Home from "./pages/Home";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  // Global state
  const userDetails = useAuthState();

  return (
    <div className="container">
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute
                  isPrivate={route.isPrivate}
                  token={userDetails.token}
                  element={route.element}
                />
              }
              isPrivate={route.isPrivate}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// privateRoute(route.isPrivate, userDetails.token, route.element)
// route.isPrivate && !Boolean(userDetails.token) ? (
//   <Navigate to="/login" />
// ) : (
//   route.element
// )
