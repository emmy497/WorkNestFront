import { useRef, useState, type ChangeEvent } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import type { ClientListItem, ClientPayload } from "../types/job";
import { createClient, updateClient, uploadClientLogo } from "../api/adminCompanies";
import { toast } from "../lib/toast";

const inputClass =
  "w-full h-[44px] rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white px-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]";

const labelClass = "mb-[8px] block font-['Inter'] text-[13px] font-medium text-[#4B4757]";

function fieldClass(hasError: boolean): string {
  return hasError
    ? inputClass
        .replace("border-[#ECEBF0]", "border-[#D14343]")
        .replace("focus:border-[#6D4AFF]", "focus:border-[#D14343]")
    : inputClass;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-[6px] font-['Inter'] text-[12px] text-[#D14343]">{message}</p>;
}

const EMPTY_FORM: ClientPayload = {
  name: "",
  industry: "",
  location: "",
  description: "",
  website: "",
  logoUrl: "",
};

export default function ClientModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: ClientListItem | null;
  onClose: () => void;
  onSaved: (client: ClientListItem) => void;
}) {
  const [form, setForm] = useState<ClientPayload>(
    initial
      ? {
          name: initial.name,
          industry: initial.industry,
          location: initial.location,
          description: initial.description,
          website: initial.website,
          logoUrl: initial.logoUrl,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ClientPayload>(key: K, value: ClientPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingLogo(true);
    try {
      const { logoUrl } = await uploadClientLogo(file);
      update("logoUrl", logoUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload that logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Client name is required";
    if (!form.industry.trim()) next.industry = "Industry is required";
    if (!form.location.trim()) next.location = "Location is required";
    return next;
  }

  async function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      const payload: ClientPayload = {
        name: form.name.trim(),
        industry: form.industry.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        logoUrl: form.logoUrl,
      };
      const saved = initial ? await updateClient(initial.id, payload) : await createClient(payload);
      toast.success(initial ? "Client updated" : "Client added");
      onSaved(saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save this client");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[16px]">
      <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-[20px] bg-white p-[26px] sm:p-[28px]">
        <div className="mb-[20px] flex items-center justify-between">
          <h2 className="font-['Bricolage_Grotesque'] font-extrabold text-[22px] text-[#161320]">
            {initial ? "Edit client" : "New client"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-[30px] items-center justify-center rounded-full text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#161320]"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div>
            <label className={labelClass}>Company logo</label>
            <div className="flex flex-wrap items-center gap-[14px]">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt=""
                  className="size-[72px] shrink-0 rounded-[14px] border-[1.07px] border-[#ECEBF0] object-cover"
                />
              ) : (
                <div className="size-[72px] shrink-0 rounded-[14px] bg-[#ECEBF0]" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="flex items-center gap-[8px] rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[11px] font-['Inter'] text-[13.5px] font-semibold text-[#161320] hover:bg-[#FAFAFB] disabled:opacity-60"
              >
                <FiUpload size={14} />
                {uploadingLogo ? "Uploading…" : "Upload logo"}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Company name</label>
            <input
              className={fieldClass(Boolean(errors.name))}
              placeholder="e.g. Moniepoint"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <div>
              <label className={labelClass}>Industry</label>
              <input
                className={fieldClass(Boolean(errors.industry))}
                placeholder="e.g. Fintech"
                value={form.industry}
                onChange={(e) => update("industry", e.target.value)}
              />
              <FieldError message={errors.industry} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={fieldClass(Boolean(errors.location))}
                placeholder="Lagos, Nigeria"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
              <FieldError message={errors.location} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Website <span className="text-[#8B8798]">(optional)</span>
            </label>
            <input
              className={inputClass}
              placeholder="company.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Short description <span className="text-[#8B8798]">(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-[12px] border-[1.07px] border-[#ECEBF0] bg-white p-[14px] font-['Inter'] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
              placeholder="What does this company do?"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-[22px] flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[20px] py-[11px] font-['Inter'] font-medium text-[13.5px] text-[#161320]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || uploadingLogo}
            className="rounded-full bg-[#6D4AFF] px-[20px] py-[11px] font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.25)] disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save client"}
          </button>
        </div>
      </div>
    </div>
  );
}
