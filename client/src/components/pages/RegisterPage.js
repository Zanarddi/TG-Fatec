import RegisterForm from "../forms/RegisterForm";

function RegisterPage() {
  return (
    <div className="RegisterPage">
      <div className='wrapper'>
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
