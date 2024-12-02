import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Setup from "./pages/Setup";
import Home from "./pages/Home";
import CaroLobby from "./pages/CaroLobby";
import Chats from "./pages/Chats";
import LayoutWrapper from "./components/LayoutWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import { UserProvider } from "./context/UserContext";
import { CaroSocketProvider } from "./context/CaroSocketContext";
import CaroBattleWrapper from "./pages/CaroBattleWrapper";
import ProfileWrapper from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Same Layout Route */}
          <Route path="/" element={<LayoutWrapper />}>
            <Route index element={<Home />} />
            <Route path="profile/:username" element={<ProfileWrapper />} />
            {/* Protected routes */}

            <Route
              path="chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="caro"
              element={
                <CaroSocketProvider>
                  <Outlet />
                </CaroSocketProvider>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <CaroLobby />
                  </ProtectedRoute>
                }
              />
              <Route path="game/live/:gameId" element={<CaroBattleWrapper />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<Setup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
