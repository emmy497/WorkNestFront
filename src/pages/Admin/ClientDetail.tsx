import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiExternalLink, FiMapPin, FiPlus } from "react-icons/fi";
import type { ClientDetail as ClientDetailType, ClientListItem, JobStatus } from "../../types/job";
import { fetchClientDetail } from "../../api/adminCompanies";
import ClientModal from "../../components/ClientModal";

const AVATAR_COLORS = ["#161320", "#2D5BFF", "#6D4AFF", "#1E9E5A", "#C2760C", "#D9651B"];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[Math.abs(hash)];
}

const STATUS_CONFIG: Record<JobStatus, { label: string; dot: string; badgeBg: string; badgeText: string }> = {
  open: { label: "Published", dot: "#1E9E5A", badgeBg: "#E9F9F0", badgeText: "#127A3E" },
  draft: { label: "Draft", dot: "#C2760C", badgeBg: "#FFF1DE", badgeText: "#8A5A12" },
  closed: { label: "Closed", dot: "#8B8798", badgeBg: "#F2F1F6", badgeText: "#4B4757" },
  archived: { label: "Archived", dot: "#8B8798", badgeBg: "#F2F1F6", badgeText: "#8B8798" },
};

function formatCloses(job: { status: JobStatus; closesAt: string }): { text: string; urgent: boolean } {
  if (job.status === "draft") return { text: "—", urgent: false };

  const diffDays = Math.ceil((new Date(job.closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { text: "Closed", urgent: false };
  return { text: `in ${diffDays} ${diffDays === 1 ? "day" : "days"}`, urgent: diffDays <= 3 };
}

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchClientDetail(id)
      .then(setClient)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this client"))
      .finally(() => setLoading(false));
  }, [id]);

  function goToNewRole() {
    if (!client) return;
    navigate("/admin/jobs/new", { state: { companyId: client.id } });
  }

  function handleSaved(saved: ClientListItem) {
    setClient((prev) => (prev ? { ...prev, ...saved } : prev));
    setEditing(false);
  }

  if (loading) {
    return (
      <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
        Loading client…
      </p>
    );
  }

  if (error || !client) {
    return (
      <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">
        {error || "Client not found."}
      </p>
    );
  }

  return (
    <div>
      <NavLink
        to="/admin/clients"
        className="mb-[16px] inline-flex items-center gap-[7px] font-['Inter'] text-[13px] text-[#8B8798] hover:text-[#161320]"
      >
        <FiArrowLeft size={14} />
        Back to clients
      </NavLink>

      <div className="mb-[20px] rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px] sm:p-[26px]">
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div className="flex items-start gap-[16px]">
            {client.logoUrl ? (
              <img
                src={client.logoUrl}
                alt=""
                className="size-[64px] shrink-0 rounded-[14px] object-cover"
              />
            ) : (
              <div
                className="flex size-[64px] shrink-0 items-center justify-center rounded-[14px] font-['Inter'] text-[22px] font-bold text-white"
                style={{ backgroundColor: avatarColor(client.name) }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="mb-[8px] font-['Bricolage_Grotesque'] font-extrabold text-[24px] text-[#161320] sm:text-[28px]">
                {client.name}
              </h1>

              <div className="mb-[10px] flex flex-wrap items-center gap-[8px]">
                {client.industry && (
                  <span className="rounded-full border-[1.07px] border-[#ECEBF0] px-[12px] py-[5px] font-['Inter'] text-[12.5px] text-[#4B4757]">
                    {client.industry}
                  </span>
                )}
                {client.location && (
                  <span className="flex items-center gap-[5px] rounded-full border-[1.07px] border-[#ECEBF0] px-[12px] py-[5px] font-['Inter'] text-[12.5px] text-[#4B4757]">
                    <FiMapPin size={12} />
                    {client.location}
                  </span>
                )}
              </div>

              {client.website && (
                <a
                  href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-[10px] inline-flex items-center gap-[5px] font-['Inter'] text-[13.5px] font-medium text-[#6D4AFF] hover:underline"
                >
                  {client.website.replace(/^https?:\/\//, "")}
                  <FiExternalLink size={12} />
                </a>
              )}

              {client.description && (
                <p className="max-w-[560px] font-['Inter'] text-[13.5px] leading-relaxed text-[#4B4757]">
                  {client.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-[10px]">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[18px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-[#161320] hover:bg-[#FAFAFB]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={goToNewRole}
              className="rounded-full bg-[#6D4AFF] px-[18px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0]"
            >
              New role
            </button>
          </div>
        </div>
      </div>

      <div className="mb-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-3">
        <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[20px]">
          <div className="font-['Bricolage_Grotesque'] font-extrabold text-[28px] text-[#161320]">
            {client.openRoles}
          </div>
          <div className="mt-[4px] font-['Inter'] text-[13px] text-[#8B8798]">Open roles</div>
        </div>
        <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[20px]">
          <div className="font-['Bricolage_Grotesque'] font-extrabold text-[28px] text-[#161320]">
            {client.totalApplicants}
          </div>
          <div className="mt-[4px] font-['Inter'] text-[13px] text-[#8B8798]">Total applicants</div>
        </div>
        <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[20px]">
          <div className="font-['Bricolage_Grotesque'] font-extrabold text-[28px] text-[#161320]">
            {client.placements}
          </div>
          <div className="mt-[4px] font-['Inter'] text-[13px] text-[#8B8798]">Placements made</div>
        </div>
      </div>

      <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
        <div className="mb-[16px] flex items-center justify-between">
          <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
            Roles for {client.name}
          </h2>
          <button
            type="button"
            onClick={goToNewRole}
            className="flex items-center gap-[6px] font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
          >
            <FiPlus size={13} />
            New role
          </button>
        </div>

        {client.jobs.length === 0 ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
            No roles posted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b-[1.07px] border-b-[#ECEBF0] font-['Inter'] text-[11px] font-semibold tracking-[0.06em] text-[#8B8798]">
                  <th className="py-[10px] text-left">ROLE</th>
                  <th className="py-[10px] text-left">STATUS</th>
                  <th className="py-[10px] text-left">APPLICANTS</th>
                  <th className="py-[10px] text-left">CLOSES</th>
                </tr>
              </thead>
              <tbody>
                {client.jobs.map((job) => {
                  const statusConfig = STATUS_CONFIG[job.status];
                  const closes = formatCloses(job);

                  return (
                    <tr key={job.id} className="border-b-[1.07px] border-b-[#ECEBF0] last:border-b-0">
                      <td className="min-w-0 py-[14px] pr-[16px]">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          {client.logoUrl ? (
                            <img
                              src={client.logoUrl}
                              alt=""
                              className="size-[34px] shrink-0 rounded-[10px] object-cover"
                            />
                          ) : (
                            <div
                              className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] font-['Inter'] text-[13px] font-bold text-white"
                              style={{ backgroundColor: avatarColor(client.name) }}
                            >
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                              {job.title}
                            </div>
                            <div className="truncate font-['Inter'] text-[11.5px] text-[#8B8798]">
                              {job.jobType} · {job.experienceLevel}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px]">
                        <span
                          className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-['Inter'] text-[11.5px] font-semibold"
                          style={{ backgroundColor: statusConfig.badgeBg, color: statusConfig.badgeText }}
                        >
                          <span className="size-[6px] rounded-full" style={{ backgroundColor: statusConfig.dot }} />
                          {statusConfig.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px] font-['Inter'] text-[13px] text-[#161320]">
                        {job.status === "draft" ? "—" : job.applicantCount}
                      </td>

                      <td
                        className="whitespace-nowrap py-[14px] font-['Inter'] text-[13px]"
                        style={{ color: closes.urgent ? "#C62828" : "#4B4757" }}
                      >
                        {closes.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ClientModal initial={client} onClose={() => setEditing(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default ClientDetail;
