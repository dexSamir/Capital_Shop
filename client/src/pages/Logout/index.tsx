import "./Logout.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="logout">
      <div className="logout__container">
        <div className="logout__header">
          <h1 className="logout__title">Are you sure you want to log out?</h1>
          <p className="logout__text">
            You will be returned to the login screen.
          </p>
        </div>

        <div className="logout__actions">
          <button onClick={handleLogout} className="logout__button logout__button--danger">
            Confirm Logout
          </button>

          <Link to="/" className="logout__button">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Logout;