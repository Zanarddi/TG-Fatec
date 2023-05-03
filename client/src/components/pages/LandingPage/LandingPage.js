import GlobalHeader from "../../GlobalHeader/GlobalHeader";
import axios from "axios";

function LandingPage() {

  function reset() {
    axios.post(process.env.REACT_APP_API_URL + '/api/reset/email', {
      email: "teste@teste.com"
    })
      .then(data => {
        console.log(data.data);
      })
      .catch((error) => {
        console.log(error.response.status);
        console.log(error.response.data);
      });
  }

  return (
    <div className="LandingPage">
      <GlobalHeader isLogged={false} />
      <section id="explanation">
        <p>explanation</p>
      </section>
      <section id="about-us">
        <p>about us</p>
      </section>
      <section id="join">
        <p>join</p>
      </section>
      <button onClick={reset}>Test reset</button>
    </div>
  );
}

export default LandingPage;
