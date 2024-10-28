import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Setup from "./pages/Setup";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Chats from "./pages/Chats";
import LayoutWrapper from "./components/LayoutWrapper";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutWrapper />}>
            <Route index element={<Home />} />

            {/* Protected routes */}
            <Route
              path="profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="games"
              element={<ProtectedRoute element={<Games />} />}
            />
            <Route
              path="chats"
              element={<ProtectedRoute element={<Chats />} />}
            />

            <Route
              path="settings"
              element={<ProtectedRoute element={<Settings />} />}
            />
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
