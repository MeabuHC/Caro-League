import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Setup from "./pages/Setup";
import GuestHome from "./pages/GuestHome";
import Chats from "./pages/Chats";
import LayoutWrapper from "./components/LayoutWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import { UserProvider } from "./context/UserContext";
import { CaroSocketProvider } from "./context/CaroSocketContext";
import CaroBattleWrapper from "./pages/CaroBattleWrapper";
import ProfileWrapper from "./pages/Profile";
import UserHome from "./pages/UserHome";
import CaroLobbyLayout from "./pages/CaroLobbyLayout";
import CaroLobbyMainMenu from "./components/caro-lobby/CaroLobbyMainMenu";
import CaroLobbyOnlineMenu from "./components/caro-lobby/CaroLobbyOnlineMenu";
import CaroMatchmaking from "./components/caro-lobby/CaroMatchmaking";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Same Layout Route */}
          <Route path="/" element={<LayoutWrapper />}>
            <Route index element={<GuestHome />} />
            <Route path="/home" element={<UserHome />} />
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

            <Route path="/play" element={<CaroLobbyLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <CaroLobbyMainMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="online"
                element={
                  <ProtectedRoute>
                    <CaroLobbyOnlineMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="online/friend"
                element={
                  <ProtectedRoute>
                    <CaroLobbyOnlineMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="online/new"
                element={
                  <ProtectedRoute>
                    <CaroSocketProvider>
                      <CaroMatchmaking />
                    </CaroSocketProvider>
                  </ProtectedRoute>
                }
              />

              <Route path="computer" element={<CaroLobbyMainMenu />} />
            </Route>
            <Route
              path="play/game/live/:gameId"
              element={
                <CaroSocketProvider>
                  <CaroBattleWrapper />
                </CaroSocketProvider>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<Setup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
