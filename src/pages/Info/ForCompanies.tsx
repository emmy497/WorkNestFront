import { Link } from "react-router-dom";
import InfoPage, { InfoSection } from "../../components/InfoPage";

const steps = [
  { title: "Tell us about the role", body: "Share the job, the salary range, the deadline, and any screening questions you want every candidate to answer." },
  { title: "We publish and promote it", body: "Your role goes live on WorkNest with your company profile, and candidates can apply in minutes." },
  { title: "We review every applicant", body: "Our team reads each application, scores candidates on skills, experience, communication and portfolio, and keeps notes." },
  { title: "You meet a shortlist", body: "You see the strongest candidates, already screened. We handle interviews, offers and keeping every candidate updated." },
];

const ForCompanies = () => (
  <InfoPage
    eyebrow="For companies"
    title="Hire through WorkNest"
    intro="Tell us who you need. We publish the role, review every applicant, and bring you a shortlist of people worth meeting, while every candidate hears back."
  >
    <InfoSection id="how-hiring-works" title="How hiring works">
      <ol className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={step.title} className="!ml-0 flex !list-none gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-semibold text-[#6D4AFF]">
              {i + 1}
            </span>
            <span>
              <strong>{step.title}.</strong> {step.body}
            </span>
          </li>
        ))}
      </ol>
    </InfoSection>

    <InfoSection title="What you get">
      <ul>
        <li>A company profile with your logo, description and every open role.</li>
        <li>Custom screening questions on each job, answered by every applicant.</li>
        <li>A clear pipeline from submitted to hired, with a full history for each candidate.</li>
        <li>Candidates kept informed automatically at every stage, so your brand stays respected.</li>
      </ul>
    </InfoSection>

    <InfoSection id="talk-to-us" title="Talk to us">
      <p>
        Ready to hire, or just exploring? Email <a href="mailto:hiring@worknest.co">hiring@worknest.co</a> with the role
        you're hiring for, and we'll reply within one working day. You can also reach us through our{" "}
        <Link to="/contact">contact page</Link>.
      </p>
    </InfoSection>
  </InfoPage>
);

export default ForCompanies;
