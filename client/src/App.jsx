import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ChatBody from "./components/chats/ChatBody";
import ChatBodyEmpty from "./components/chats/ChatBodyEmpty";
import Shop from "./pages/Shop";
import Friends from "./pages/Friends";
import SuccessPayment from "./pages/SuccessPayment";
import CaroLobbyComputer from "./components/caro-lobby/CaroLobbyComputer";
import CaroMatchmakingComputer from "./components/caro-lobby/CaroMatchmakingComputer";
import CaroComputerBattle from "./pages/CaroComputerBattle";

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
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />

            <Route
              path="chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            >
              <Route index element={<ChatBodyEmpty />} />
              <Route path=":id" element={<ChatBody />} />
            </Route>

            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/play"
              element={
                <ProtectedRoute>
                  <CaroLobbyLayout />
                </ProtectedRoute>
              }
            >
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

              <Route
                path="computer"
                element={
                  <ProtectedRoute>
                    <CaroLobbyComputer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="computer/new"
                element={
                  <ProtectedRoute>
                    <CaroSocketProvider>
                      <CaroMatchmakingComputer />
                    </CaroSocketProvider>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="play/game/live/:gameId"
              element={
                <CaroSocketProvider>
                  <CaroBattleWrapper />
                </CaroSocketProvider>
              }
            />

            <Route
              path="play/game/computer/:gameId"
              element={
                <CaroSocketProvider>
                  <CaroComputerBattle />
                </CaroSocketProvider>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<Setup />} />
          <Route path="/payment-success" element={<SuccessPayment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
