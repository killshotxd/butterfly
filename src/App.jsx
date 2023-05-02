import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import Login from "./components/pages/Login";
import { UserAuth } from "./components/context/AuthContext";
import Header from "./components/layouts/Header";
import Profile from "./components/pages/Profile/Profile";

const App = () => {
  const { currentUser } = UserAuth();
  return (
    <>
      {currentUser ? (
        <>
          <Header />
        </>
      ) : (
        ""
      )}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
