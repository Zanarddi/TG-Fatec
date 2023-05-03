import GlobalHeader from "../../GlobalHeader/GlobalHeader";

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
      <script src="dist/js/main.min.js"></script>
      <script src="https://unpkg.com/animejs@3.0.1/lib/anime.min.js"></script>
      <script src="https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js"></script>
    </div>
  );
}

export default LandingPage;
