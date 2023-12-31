import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

//Navigate is a react-router-dom component.
//It allows you to navigate between different pages.
// useNavigate is a hook function.

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user)
  return  currentUser? <Outlet /> : <Navigate to="/sign-in" />
}
