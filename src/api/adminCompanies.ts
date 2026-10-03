import type { ClientDetail, ClientListItem, ClientPayload, CompanyOption } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

// ---------------------------------------------------------------------------
// GET /api/admin/companies
//
// The "Client" dropdown on the New Role form.
// ---------------------------------------------------------------------------
export async function fetchCompanies(): Promise<CompanyOption[]> {
  try {
    const res = await apiClient.get<CompanyOption[]>("/admin/companies");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load clients"));
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/companies/clients
//
// Every client plus its computed open-roles/placements stats — the Clients
// page's card grid.
// ---------------------------------------------------------------------------
export async function fetchClients(): Promise<ClientListItem[]> {
  try {
    const res = await apiClient.get<ClientListItem[]>("/admin/companies/clients");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load clients"));
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/companies/clients/:id
//
// The Client detail page — the company plus every one of its jobs.
// ---------------------------------------------------------------------------
export async function fetchClientDetail(id: string): Promise<ClientDetail> {
  try {
    const res = await apiClient.get<ClientDetail>(`/admin/companies/clients/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load this client"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/companies/clients/logo   (multipart/form-data)
//
// No "Content-Type" header on purpose — same reasoning as uploadMyCv in
// src/api/profile.ts, the browser sets the multipart boundary itself.
// Standalone rather than tied to a client id, so "New client" can upload the
// logo before the company exists; the modal holds the returned URL and
// sends it along with the rest of the form on submit.
// ---------------------------------------------------------------------------
export async function uploadClientLogo(file: File): Promise<{ logoUrl: string }> {
  const formData = new FormData();
  formData.append("logo", file);

  try {
    const res = await apiClient.post<{ logoUrl: string }>("/admin/companies/clients/logo", formData);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not upload this logo"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/companies/clients
// ---------------------------------------------------------------------------
export async function createClient(payload: ClientPayload): Promise<ClientListItem> {
  try {
    const res = await apiClient.post<ClientListItem>("/admin/companies/clients", payload);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not create this client"));
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/companies/clients/:id
// ---------------------------------------------------------------------------
export async function updateClient(id: string, payload: ClientPayload): Promise<ClientListItem> {
  try {
    const res = await apiClient.patch<ClientListItem>(`/admin/companies/clients/${id}`, payload);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not update this client"));
  }
}
