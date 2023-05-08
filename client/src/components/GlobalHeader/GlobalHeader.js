import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from './../img/tg-logo.png'
import logoFull from './../img/tg-logofull.png'
import './style.css'
axios.defaults.withCredentials = true;


function GlobalHeader(props) {

  const navigate = useNavigate();
  const logOut = () => {
    
    (async () => {
      console.log('/logout');
      await axios.post(process.env.REACT_APP_API_URL + '/logout', { withCredentials: true }).then(()=>{
        localStorage.removeItem('appToken');
        navigate('/login');
    })
    })();
    
  }

  if (props.isLogged) {
    return (
      <div className="global_header">
        <nav>
          <ul className="nav-load">
            <li className="site-name" key='site-logo'>
              <a id="header-icon" title="Yep, that's me!" href="/dashboard">
                <img alt="Social Cat logo"
                  src={logo}
                  width="48" height="48" />
              </a>
            </li>
            <li key='home'>
              <a id="header-home" title="Go back to your dashboard." href="/dashboard">Home</a>
            </li>
            <li key='settings'>
              <a title="Manage your Settings." href="/settings">Settings</a>
            </li>
            <li key='sign-out'>
              <a id="header-logout" title="Sign Out." onClick={logOut} >Sign Out</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
  else {
    return (
      <div className="global_header">
        <nav>
          <ul className="nav-load">
            <li className="site-name">
              <a id="header-icon" title="Yep, that's me!" href="/">
                <img alt="Social Cat logo"
                  src={logoFull} id="logo-landingpage" />
              </a>
            </li>
            {/* <li>
              <a id="header-explanation" title="Read more about this project." href="#explanation">Explanation</a>
            </li>
            <li>
              <a id="header-aboutus" title="Read more about the authors." href="#aboutus">About us</a>
            </li> */}
            <li>
              <a id="header-login" title="Already have an account? Sign in." href="/login">Sign In</a>
            </li>
            <li>
              <a id="header-signup" title="Create your accoount right now." href="/signup">Join Us</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default GlobalHeader;