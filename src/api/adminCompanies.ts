import type { ClientDetail, ClientListItem, ClientPayload, CompanyOption } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchCompanies(): Promise<CompanyOption[]> {
  try {
    const res = await apiClient.get<CompanyOption[]>("/admin/companies");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load clients"));
  }
}

export async function fetchClients(): Promise<ClientListItem[]> {
  try {
    const res = await apiClient.get<ClientListItem[]>("/admin/companies/clients");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load clients"));
  }
}

export async function fetchClientDetail(id: string): Promise<ClientDetail> {
  try {
    const res = await apiClient.get<ClientDetail>(`/admin/companies/clients/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load this client"));
  }
}

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

export async function createClient(payload: ClientPayload): Promise<ClientListItem> {
  try {
    const res = await apiClient.post<ClientListItem>("/admin/companies/clients", payload);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not create this client"));
  }
}

export async function updateClient(id: string, payload: ClientPayload): Promise<ClientListItem> {
  try {
    const res = await apiClient.patch<ClientListItem>(`/admin/companies/clients/${id}`, payload);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not update this client"));
  }
}
