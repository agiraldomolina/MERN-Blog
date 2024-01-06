import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

//Navigate is a react-router-dom component.
//It allows you to navigate between different pages.
// useNavigate is a hook function.

export default function OnlyAdminPrivateRoute() {
    const { currentUser } = useSelector(state => state.user)
  return  currentUser &&  currentUser.isAdmin? <Outlet /> : <Navigate to="/sign-in" />
}
