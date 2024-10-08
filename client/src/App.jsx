import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./providers/SocketProvider";
import Auth from "./routes/Auth";
import AuthProviderProtected from './protected-route/AuthProviderProtected';
import AuthProtector from "./protected-route/AuthProtector";
import ProtectedRoute from "./protected-route/ProtectedRoute";
import Welcome from "./routes/Welcome";
import AdminProtected from "./protected-route/AdminProtected";
import Dashboard from "./routes/admin/Dashboard";
import CreatePage from "./routes/admin/CreatePage";
import AdminRAH from "./routes/admin/AdminRAH";
import PrivateStream from "./routes/admin/PrivateStream";
import UserProtected from "./protected-route/UserProtected";
import MainStream from "./routes/user/MainStream";
import PublicStream from "./routes/PublicStream";
import PublicStreamProtected from "./protected-route/PublicStreamProtected";
import Home from './routes/Home';
import JoinWaitlist from './routes/JoinWaitlist';
import ExploreUseCases from './routes/ExploreUseCases';
import AboutUs from './routes/AboutUs';

import Blogs from './routes/blogs/Blogs';
import Blog_1 from './routes/blogs/Blog_1';
import Blog_2 from './routes/blogs/Blog_2';
import Blog_3 from './routes/blogs/Blog_3';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/join-waitlist' element={<JoinWaitlist />} />
      <Route path='/explore-use-cases' element={<ExploreUseCases />} />
      <Route path='/about-us' element={<AboutUs />} />
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/blog/the-best-way-to-engaging-with-your-fans-via-voice-chat-on-youtube-live' element={<Blog_1 />} />
      <Route path='/blog/how-to-talk-on-youtube-live-streams' element={<Blog_2 />} />
      <Route path='/blog/how-zuptalk-transforms-youtube-live-streams' element={<Blog_3 />} />

      <Route element={<AuthProviderProtected />}>
        <Route element={<AuthProtector />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route element={<PublicStreamProtected />}>
          <Route path="/public-stream/:roomId" element={<PublicStream />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<Welcome />} />

          <Route element={<AdminProtected />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-page" element={<CreatePage />} />
            <Route path="/private-stream/:roomId" element={<PrivateStream />} />
            <Route
              path="/admin-rah/:roomId"
              element={
                <SocketProvider>
                  <AdminRAH />
                </SocketProvider>
              }
            />
          </Route>
          <Route element={<UserProtected />}>
            <Route
              path="/main-stream/:roomId"
              element={
                <SocketProvider>
                  <MainStream />
                </SocketProvider>
              }
            />
          </Route>
        </Route>
      </Route>

    </>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  );
}
