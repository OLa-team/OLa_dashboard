import "./App.css";
import "./Responsive.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import routes from "./routes/routes";
import { useAuthState, usePatientDispatch, usePatientState } from "./context";
import Home from "./pages/Home";
import PrivateRoute from "./routes/PrivateRoute";
import { setCurrentPatient } from "./service";
import { useEffect } from "react";

function App() {
  // Global state
  const userDetails = useAuthState();

  const params = useParams();

  const patientState = usePatientState();
  const patientDispatch = usePatientDispatch();

  async function resetCurrentPatient() {
    await setCurrentPatient(patientDispatch, params.patientId);
  }

  console.log("patientState", patientState);

  useEffect(() => {
    // resetCurrentPatient();
    // window.location.reload();
    // alert("!23");
  }, []);

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
