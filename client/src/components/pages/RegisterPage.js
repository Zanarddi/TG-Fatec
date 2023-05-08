import RegisterForm from "../forms/RegisterForm";
import logo from "../img/tg-logo-light.png";

function RegisterPage() {
  return (
    <div className="RegisterPage">
      <div className='wrapper'>
        <img src={logo} id="image-logo" className="img-fluid rounded d-block mx-auto" alt="Work 1" />
        <p className="title-access">Sign up</p>
        <RegisterForm></RegisterForm>
        <hr></hr>
        <div className="links">
          <ul>
            <li><a href="/login">Sign in</a></li>
            <li><a href="/">Return to landing page</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
