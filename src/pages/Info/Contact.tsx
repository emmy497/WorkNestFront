import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import InfoPage, { InfoSection } from "../../components/InfoPage";

const TOPICS = [
  { value: "hello@worknest.co", label: "A question about my account or application" },
  { value: "hiring@worknest.co", label: "Hiring through WorkNest" },
  { value: "privacy@worknest.co", label: "Privacy or my personal data" },
  { value: "careers@worknest.co", label: "Working at WorkNest" },
];

const inputClass =
  "w-full rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white px-4 py-3 font-['Inter'] text-[14px] text-[#161320] outline-none placeholder:text-[#8B8798] focus:border-[#6D4AFF]";

const Contact = () => {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a message.");
      return;
    }
    setError("");
    const label = TOPICS.find((t) => t.value === topic)?.label ?? "WorkNest enquiry";
    const subject = encodeURIComponent(`${label} — ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}`);
    window.location.href = `mailto:${topic}?subject=${subject}&body=${body}`;
  }

  return (
    <InfoPage
      eyebrow="Company"
      title="Contact us"
      intro="We read every message and usually reply within one working day."
    >
      <InfoSection title="Send us a message">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 font-medium text-[#4B4757]">
            What's it about?
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputClass}>
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 font-medium text-[#4B4757]">
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Okafor" className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 font-medium text-[#4B4757]">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="How can we help?"
              className={inputClass}
            />
          </label>
          {error && <p className="text-[13px] text-[#D14343]">{error}</p>}
          <button
            type="submit"
            className="self-start rounded-full bg-[#6D4AFF] px-6 py-3 font-['Inter'] text-[14px] font-semibold text-white hover:bg-[#5D3CE0]"
          >
            Open in my email app
          </button>
          <p className="text-[13px] text-[#8B8798]">This opens your email app with the message ready to send.</p>
        </form>
      </InfoSection>

      <InfoSection title="Email us directly">
        <ul>
          <li>Account or application questions: <a href="mailto:hello@worknest.co">hello@worknest.co</a></li>
          <li>Hiring through WorkNest: <a href="mailto:hiring@worknest.co">hiring@worknest.co</a></li>
          <li>Privacy and your data: <a href="mailto:privacy@worknest.co">privacy@worknest.co</a></li>
          <li>Careers: <a href="mailto:careers@worknest.co">careers@worknest.co</a></li>
        </ul>
        <p>
          Looking for a job? <Link to="/find-jobs">Browse open roles</Link>.
        </p>
      </InfoSection>
    </InfoPage>
  );
};

export default Contact;
