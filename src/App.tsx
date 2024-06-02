import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";
import DashBoard from "./pages/dashBoard";
import Register from "./pages/auth/register";
import NavBar from "./components/navbar";
import FormBuilder from "./pages/builder";
import Submit from "./pages/submit";
import Form from "./pages/form";

const MainLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

const AuthLayout = () => (
  <Outlet />
);

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <DashBoard />
            </>
          ),
        },
        {
          path: "/form/:id",
          element: (
            <>
              <Form />
            </>
          ),
        },
        {
          path: "/builder/:id",
          element: (
            <>
              <FormBuilder />
            </>
          ),
        },
        {
          path: "/submit/:shareId",
          element: (
            <>
              <Submit />
            </>
          ),
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ]
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
