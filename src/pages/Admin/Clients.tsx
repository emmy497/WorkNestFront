import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiMapPin, FiPlus } from "react-icons/fi";
import type { ClientListItem } from "../../types/job";
import { fetchClients } from "../../api/adminCompanies";
import ClientModal from "../../components/ClientModal";

const AVATAR_COLORS = ["#161320", "#2D5BFF", "#6D4AFF", "#1E9E5A", "#C2760C", "#D9651B"];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[Math.abs(hash)];
}

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalClient, setModalClient] = useState<ClientListItem | null | "new">(null);

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load clients"))
      .finally(() => setLoading(false));
  }, []);

  const visibleClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
    );
  }, [clients, search]);

  function handleSaved(client: ClientListItem) {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      return exists ? prev.map((c) => (c.id === client.id ? client : c)) : [...prev, client].sort((a, b) => a.name.localeCompare(b.name));
    });
    setModalClient(null);
  }

  return (
    <div>
      <div className="mb-[20px] flex flex-wrap items-start justify-between gap-[12px]">
        <div>
          <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
            MANAGE
          </div>
          <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[32px] text-[#161320]">
            Clients
          </h1>
          <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">
            The companies WorkNest hires for. Roles attach to a client.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalClient("new")}
          className="flex shrink-0 items-center gap-[8px] rounded-full bg-[#6D4AFF] px-[18px] py-[11px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0]"
        >
          <FiPlus size={15} />
          New client
        </button>
      </div>

      <div className="mb-[20px] flex w-full items-center gap-[10px] rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[11px] sm:ml-auto sm:max-w-[320px]">
        <svg
          className="size-[16px] shrink-0 text-[#8B8798]"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M18 18l-4.5-4.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full min-w-0 bg-transparent font-['Inter'] text-[13.5px] text-[#161320] outline-none placeholder:text-[#8B8798]"
        />
      </div>

      {loading ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          Loading clients…
        </p>
      ) : error ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">{error}</p>
      ) : visibleClients.length === 0 ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          No clients match that search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {visibleClients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/admin/clients/${client.id}`)}
              className="cursor-pointer rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[20px] transition-colors hover:border-[#D8D3F0]"
            >
              <div className="mb-[14px] flex items-start justify-between gap-[10px]">
                <div className="flex items-center gap-[12px]">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt=""
                      className="size-[44px] shrink-0 rounded-[10px] object-cover"
                    />
                  ) : (
                    <div
                      className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] font-['Inter'] text-[16px] font-bold text-white"
                      style={{ backgroundColor: avatarColor(client.name) }}
                    >
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-['Inter'] text-[15px] font-semibold text-[#161320]">
                      {client.name}
                    </div>
                    <div className="truncate font-['Inter'] text-[12.5px] text-[#8B8798]">
                      {client.industry || "—"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalClient(client);
                  }}
                  aria-label="Edit client"
                  className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border-[1.07px] border-[#ECEBF0] text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#161320]"
                >
                  <FiEdit2 size={14} />
                </button>
              </div>

              <p className="mb-[16px] line-clamp-2 font-['Inter'] text-[13px] text-[#4B4757]">
                {client.description || "No description yet."}
              </p>

              <div className="mb-[14px] h-[1px] bg-[#ECEBF0]" />

              <div className="flex flex-wrap items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[24px]">
                  <div>
                    <div className="font-['Bricolage_Grotesque'] font-extrabold text-[18px] text-[#161320]">
                      {client.openRoles}
                    </div>
                    <div className="font-['Inter'] text-[11.5px] text-[#8B8798]">Open roles</div>
                  </div>
                  <div>
                    <div className="font-['Bricolage_Grotesque'] font-extrabold text-[18px] text-[#161320]">
                      {client.placements}
                    </div>
                    <div className="font-['Inter'] text-[11.5px] text-[#8B8798]">Placements</div>
                  </div>
                </div>

                {client.location && (
                  <div className="flex items-center gap-[5px] font-['Inter'] text-[12px] text-[#8B8798]">
                    <FiMapPin size={13} />
                    {client.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalClient !== null && (
        <ClientModal
          initial={modalClient === "new" ? null : modalClient}
          onClose={() => setModalClient(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default Clients;
