import { useState, type KeyboardEvent } from "react";
import { FiX } from "react-icons/fi";

type SkillsInputProps = {
  value: string[];
  onChange: (skills: string[]) => void;
};

// A tag input: type a skill, press Enter, it becomes a removable pill.
// Duplicate and empty entries are quietly ignored rather than shown as
// errors — this is a low-stakes field, not a form that needs to scold you.
const SkillsInput = ({ value, onChange }: SkillsInputProps) => {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const skill = draft.trim();
    if (!skill) return;

    const alreadyAdded = value.some(
      (existing) => existing.toLowerCase() === skill.toLowerCase()
    );
    if (!alreadyAdded) {
      onChange([...value, skill]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // don't submit the surrounding form
      addSkill();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      // Backspace on an empty input removes the last pill — mirrors how
      // most tag inputs behave, and saves a click.
      onChange(value.slice(0, -1));
    }
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-center gap-2 rounded-[12.61px] border-[1.05px] border-[#ECEBF0] px-[15.76px] py-[10px] transition focus-within:border-[#6D4AFF]">
        {value.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1.5 rounded-full bg-[#F2EEFF] px-3 py-1 text-[13px] font-medium text-[#6D4AFF]"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="text-[#6D4AFF]/70 hover:text-[#6D4AFF]"
            >
              <FiX size={13} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={value.length === 0 ? "Type a skill and press Enter" : ""}
          className="min-w-[120px] flex-1 py-1 text-[14px] text-[#161320] outline-none placeholder:text-[#8B8798]"
        />
      </div>

      <p className="mt-2 text-[12px] text-[#8B8798]">
        Add at least 3. These help us match you to the right roles.
      </p>
    </div>
  );
};

export default SkillsInput;
