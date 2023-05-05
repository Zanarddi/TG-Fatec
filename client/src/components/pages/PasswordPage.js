import PasswordForm from "../forms/PasswordForm";
import { useSearchParams } from "react-router-dom";

function PasswordPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return (
    <div className="PasswordPage">
      <div className='wrapper'>
        <p className="title-access">Change your password</p>
        <PasswordForm token={token} email={email}></PasswordForm>
        <hr></hr>
        <div className="links">
          <ul>
            <li><a href="/signup">Sign up</a></li>
            <li><a href="/">Return to landing page</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
