import LoginForm from "../forms/LoginForm";

function LoginPage() {
  return (
    <div className="LoginPage">
      <div className='wrapper'>
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
