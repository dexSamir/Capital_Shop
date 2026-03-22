import "./Logout.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { FaSignOutAlt, FaArrowLeft, FaHome } from "react-icons/fa";

function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="logout">
      <div className="logout__panel">
        <div className="logout__icon-wrap" aria-hidden>
          <FaSignOutAlt className="logout__icon" />
        </div>
        <h1 className="logout__title">Çıxış etmək istəyirsiniz?</h1>
        <p className="logout__text">
          Sessiyanız sonlandırılacaq və təhlükəsiz giriş ekranına yönləndiriləcəksiniz.
        </p>
        <div className="logout__actions">
          <button
            type="button"
            onClick={handleLogout}
            className="logout__btn logout__btn--confirm"
          >
            <FaSignOutAlt />
            Bəli, çıxış
          </button>
          <Link to="/" className="logout__btn logout__btn--ghost">
            <FaHome />
            Ana səhifə
          </Link>
        </div>
        <Link to="/products" className="logout__back">
          <FaArrowLeft />
          Alış-verişə davam et
        </Link>
      </div>
    </div>
  );
}

export default Logout;
