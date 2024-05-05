import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute"
import Login from "./pages/login"
import DashBoard from "./pages/dashBoard"
import Register from "./pages/register"

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <Login />
      )
    },
    {
      path: "/register",
      element: (
        <Register />
      )
    },
    {
      path: "/",
      element: <ProtectedRoute><DashBoard /></ProtectedRoute>
    },
    {
      path: "/form/:id",
      element: <></>
    },
    {
      path: "/builder/:id",
      element: <></>
    },
  ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
