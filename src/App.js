import "./App.css";
import Navbar from "./layouts/navbar";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import About from "./pages/about";
import ContactUs from "./pages/contact-us";
import Service from "./pages/service";
import Login from "./pages/login";
// import Footer from "./layouts/footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    ),
    children: [
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/service",
        element: <Service />,
      },
      {
        path: "/contact_us",
        element: <ContactUs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
