import { Link } from "react-router-dom";
import InfoPage, { InfoSection } from "../../components/InfoPage";

const About = () => (
  <InfoPage
    eyebrow="Company"
    title="About WorkNest"
    intro="WorkNest is a hiring hub where a real person reviews your application and gets you in front of the companies actually hiring."
  >
    <InfoSection title="Why we started">
      <p>
        Job hunting is broken on both sides. Candidates send applications into silence and never find out what happened.
        Recruiters track hundreds of applicants across email and spreadsheets. We built WorkNest so both sides work in one
        place, and nobody is left wondering.
      </p>
    </InfoSection>

    <InfoSection title="What we believe">
      <ul>
        <li><strong>Every applicant deserves an answer.</strong> Candidates can see the stage of every application, and we update them as it moves.</li>
        <li><strong>Fill it in once.</strong> Your profile fills in every application, so you never retype the same details.</li>
        <li><strong>People over keyword filters.</strong> A member of our team reviews each application.</li>
      </ul>
    </InfoSection>

    <InfoSection id="careers" title="Careers">
      <p>
        We're a small team and we're not hiring for WorkNest itself right now. If you'd like to be considered when we are,
        send your CV to <a href="mailto:careers@worknest.co">careers@worknest.co</a>. Looking for a job with one of our
        client companies instead? <Link to="/find-jobs">Browse open roles</Link>.
      </p>
    </InfoSection>

    <InfoSection title="Get in touch">
      <p>
        Questions, feedback or partnerships: visit our <Link to="/contact">contact page</Link>.
      </p>
    </InfoSection>
  </InfoPage>
);

export default About;
