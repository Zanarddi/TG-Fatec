import LoginForm from "../forms/LoginForm";
import { useSearchParams } from "react-router-dom";

function PasswordPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return (
    <div className="PasswordPage">
      <div className='wrapper'>
        <p>PASSWORD PAGE</p>
        <p>token: {token}</p>
        <p>email: {email}</p>
        <LoginForm></LoginForm>
        <hr></hr>
        <div className="links">
          <ul>
            <li><a href="/signup">Sign up</a></li>
            <li><a href="/">Forgot password?</a></li>
            <li><a href="/">Return to landing page</a></li>
            <li><a href="/">Didn't receive confirmation instructions?</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
