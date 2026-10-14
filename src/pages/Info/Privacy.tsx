import { Link } from "react-router-dom";
import InfoPage, { InfoSection } from "../../components/InfoPage";

const Privacy = () => (
  <InfoPage
    eyebrow="Legal"
    title="Privacy Policy"
    updated="14 October 2026"
    intro="This policy explains what personal data WorkNest collects, why, who we share it with, and the choices you have. We follow the Nigeria Data Protection Act 2023."
  >
    <InfoSection title="1. What we collect">
      <ul>
        <li><strong>Account details:</strong> your name, email address and password (stored only as a secure hash, never in readable form).</li>
        <li><strong>Profile details:</strong> headline, location, phone number, years of experience, skills, job preferences, expected salary, availability, and links such as your portfolio and LinkedIn.</li>
        <li><strong>Your CV</strong> and anything else you upload.</li>
        <li><strong>Applications:</strong> the roles you apply to, your answers to screening questions, and the stage each application is at.</li>
        <li><strong>Google sign-in:</strong> if you use it, your Google account's name, email address and account ID.</li>
        <li><strong>Saved jobs and notifications</strong> linked to your account.</li>
      </ul>
    </InfoSection>

    <InfoSection title="2. Why we use it">
      <ul>
        <li>To create and secure your account, including verifying your email with a one-time code.</li>
        <li>To fill in applications for you and send them to the hiring team for that role.</li>
        <li>To keep you updated on your applications by email and in the app.</li>
        <li>To remind you when a saved job is about to close and to suggest matching roles.</li>
        <li>To keep the platform safe, for example by limiting wrong code guesses and repeated uploads.</li>
      </ul>
      <p>We do not sell your personal data, and we do not use it for advertising.</p>
    </InfoSection>

    <InfoSection title="3. Who can see it">
      <ul>
        <li><strong>WorkNest's hiring team</strong> sees your profile and applications so they can review them.</li>
        <li><strong>Client companies</strong> see your application only for the roles you applied to.</li>
        <li>Recruiters' internal scores and notes about you are never shown to other candidates.</li>
      </ul>
    </InfoSection>

    <InfoSection title="4. Services we use">
      <p>We use trusted providers to run WorkNest. They process data only on our behalf:</p>
      <ul>
        <li><strong>MongoDB Atlas</strong> stores our database.</li>
        <li><strong>Cloudinary</strong> stores uploaded CVs and company logos.</li>
        <li><strong>Brevo</strong> sends our emails, such as verification codes and application updates.</li>
        <li><strong>Google</strong> handles sign-in, if you choose "Continue with Google".</li>
        <li><strong>Vercel</strong> hosts the website.</li>
      </ul>
      <p>Some of these providers may store data outside Nigeria, with safeguards required by the Nigeria Data Protection Act.</p>
    </InfoSection>

    <InfoSection title="5. Cookies and local storage">
      <p>
        WorkNest does not use advertising or tracking cookies. When you log in, we keep a sign-in token in your browser's
        local storage so you stay logged in. Logging out removes it.
      </p>
    </InfoSection>

    <InfoSection title="6. How long we keep it">
      <p>
        We keep your account and applications while your account is open. If you ask us to delete your account, we will
        delete your profile, CV and applications, except where we must keep a record by law. Guest applications are kept
        for as long as the hiring process for that role needs them.
      </p>
    </InfoSection>

    <InfoSection title="7. Your rights">
      <p>Under the Nigeria Data Protection Act 2023, you can ask us to:</p>
      <ul>
        <li>give you a copy of the personal data we hold about you;</li>
        <li>correct anything that is wrong (you can also edit your profile yourself at any time);</li>
        <li>delete your account and data;</li>
        <li>stop using your data for a particular purpose.</li>
      </ul>
      <p>
        Email <a href="mailto:privacy@worknest.co">privacy@worknest.co</a> and we will reply within 30 days. You can also
        complain to the Nigeria Data Protection Commission.
      </p>
    </InfoSection>

    <InfoSection title="8. Security">
      <p>
        Passwords and email codes are stored as secure hashes. Every request to our API is checked against your sign-in
        token and your role, and admin areas are restricted to the WorkNest team. No system is perfectly secure, so please
        use a strong, unique password.
      </p>
    </InfoSection>

    <InfoSection title="9. Changes and contact">
      <p>
        If we change this policy, we will update the date at the top of this page. Questions? Email{" "}
        <a href="mailto:privacy@worknest.co">privacy@worknest.co</a> or read our <Link to="/terms">Terms of Service</Link>.
      </p>
    </InfoSection>
  </InfoPage>
);

export default Privacy;
