import { Link } from "react-router-dom";
import InfoPage, { InfoSection } from "../../components/InfoPage";

const Terms = () => (
  <InfoPage
    eyebrow="Legal"
    title="Terms of Service"
    updated="14 October 2026"
    intro="These terms explain the rules for using WorkNest. By creating an account, applying for a job or posting a role, you agree to them. Please read them alongside our Privacy Policy."
  >
    <InfoSection title="1. Who we are">
      <p>
        WorkNest is a recruitment platform that connects job seekers with companies that are hiring. We list roles on
        behalf of our client companies, review applications, and move candidates through a hiring process. In these
        terms, "WorkNest", "we" and "us" mean the WorkNest team; "you" means anyone using the platform.
      </p>
    </InfoSection>

    <InfoSection title="2. Your account">
      <ul>
        <li>You must be at least 18 years old to create an account.</li>
        <li>You must give your real name and an email address you control. We verify it with a one-time code.</li>
        <li>Keep your password private. You are responsible for anything done through your account.</li>
        <li>If you sign in with Google, Google's own terms also apply to that sign-in.</li>
        <li>Tell us straight away at <a href="mailto:hello@worknest.co">hello@worknest.co</a> if you think someone else has accessed your account.</li>
      </ul>
    </InfoSection>

    <InfoSection title="3. Applying for jobs">
      <ul>
        <li>Everything in your profile, CV and applications must be true and your own. Do not misrepresent your experience, qualifications or identity.</li>
        <li>You can apply as a guest or with an account. Each account can apply to a role once.</li>
        <li>Answers to screening questions are shared with the hiring team for that role.</li>
        <li>Applying does not guarantee an interview or a job. Hiring decisions are made by WorkNest and our client companies.</li>
        <li>We will keep you updated on your application's stage, but we cannot always give detailed feedback.</li>
      </ul>
    </InfoSection>

    <InfoSection title="4. Companies and recruiters">
      <ul>
        <li>Roles must be real, currently open, and described accurately, including location, job type and salary range.</li>
        <li>Candidate information may only be used to assess candidates for the role they applied to.</li>
        <li>Do not ask candidates for payment, and do not discriminate on the basis of gender, religion, ethnicity, disability or any other protected characteristic.</li>
        <li>Admin and recruiter accounts are given by WorkNest and may be removed at any time.</li>
      </ul>
    </InfoSection>

    <InfoSection title="5. Your content">
      <p>
        You keep ownership of your CV, profile and anything else you upload. You give WorkNest permission to store it,
        and to share it with the hiring team for any role you apply to, so we can run the hiring process. You can update
        your profile at any time, or ask us to delete your account.
      </p>
      <p>Uploads must be PDF or Word files up to 5 MB, and must not contain malware or someone else's personal data.</p>
    </InfoSection>

    <InfoSection title="6. Acceptable use">
      <p>You must not:</p>
      <ul>
        <li>post false, misleading, offensive or illegal content;</li>
        <li>scrape, copy or resell job listings or candidate data;</li>
        <li>try to access accounts, data or admin areas you are not allowed to;</li>
        <li>overload, disrupt or probe the platform for weaknesses, or get around rate limits;</li>
        <li>use WorkNest to send spam or unsolicited job offers.</li>
      </ul>
    </InfoSection>

    <InfoSection title="7. Suspending or closing accounts">
      <p>
        We may suspend or close an account that breaks these terms, puts other users at risk, or is used for fraud. You
        can stop using WorkNest at any time and ask us to delete your account by emailing{" "}
        <a href="mailto:hello@worknest.co">hello@worknest.co</a>.
      </p>
    </InfoSection>

    <InfoSection title="8. The service">
      <p>
        We work hard to keep WorkNest available and accurate, but we provide it "as is". Job details come from our client
        companies, and we cannot promise the platform will always be error-free or uninterrupted. To the extent the law
        allows, WorkNest is not liable for indirect losses, such as a missed opportunity, arising from using the platform.
      </p>
    </InfoSection>

    <InfoSection title="9. Your privacy">
      <p>
        We handle your personal data as described in our <Link to="/privacy">Privacy Policy</Link>, in line with the
        Nigeria Data Protection Act 2023.
      </p>
    </InfoSection>

    <InfoSection title="10. Changes to these terms">
      <p>
        We may update these terms as WorkNest grows. When we make a significant change, we will update the date at the
        top of this page and, where appropriate, let you know by email. Continuing to use WorkNest after a change means you
        accept the updated terms.
      </p>
    </InfoSection>

    <InfoSection title="11. Governing law">
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. Any dispute will be handled by the courts
        of Lagos State, unless the law requires otherwise.
      </p>
    </InfoSection>

    <InfoSection title="12. Contact us">
      <p>
        Questions about these terms? Email <a href="mailto:hello@worknest.co">hello@worknest.co</a> or visit our{" "}
        <Link to="/contact">contact page</Link>.
      </p>
    </InfoSection>
  </InfoPage>
);

export default Terms;
