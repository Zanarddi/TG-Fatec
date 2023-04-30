import GlobalHeader from "../GlobalHeader/GlobalHeader";

function LandingPage() {
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
    </div>
  );
}

export default LandingPage;
