import LoginForm from "../forms/LoginForm";
import logo from "../img/tg-logo-light.png";

function LoginPage() {
  return (
    <div className="LoginPage">
      <div className='wrapper'>
        <img src={logo} id="image-logo" className="img-fluid rounded d-block mx-auto" alt="Work 1" />
        <p className="title-access">Login</p>
        <LoginForm></LoginForm>
        <hr></hr>
        <div className="links">
          <ul>
            <li><a href="/signup">Sign up</a></li>
            <li><a href="/forgotpassword">Forgot password?</a></li>
            <li><a href="/">Return to landing page</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
