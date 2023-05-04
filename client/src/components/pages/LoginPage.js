import LoginForm from "../forms/LoginForm";

function LoginPage() {
  return (
    <div className="LoginPage">
      <div className='wrapper'>
      <LoginForm></LoginForm>
        <hr></hr>
        <div className="links">
          <ul>
            <li><a href="/signup">Sign up</a></li>
            <li><a href="/forgotpassword">Forgot password?</a></li>
            <li><a href="/">Return to landing page</a></li>
            <li><a href="/">Didn't receive confirmation instructions?</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
