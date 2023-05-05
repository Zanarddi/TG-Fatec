import EmailForm from "../forms/EmailForm";

function EmailPage() {
  return (
    <div className="EmailPage">
      <div className='wrapper'>
      <p className="title-access">Send me a verification e-mail</p>
      <EmailForm></EmailForm>
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

export default EmailPage;