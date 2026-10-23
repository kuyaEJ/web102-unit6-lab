import { BrowserRouter, Outlet, Link } from "react-router";
import "../App.css"
function Layout() {
  return (
    <div className='Layout'>
        <nav>
            <Link className="homeLink" to="/">Home</Link>
        </nav>
        <Outlet />
    </div>
  )
};
export default Layout
