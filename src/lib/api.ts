export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export type Order = {
  id: number;
  proposta: string;
  cliente: string;
  grupo: string;
  destino: string;
  valorCarga?: number;
  volumeM3?: number;
  valorFrete?: number;
  status: string;
  criadoEm?: string;
  freteBase?: number;
  pedagio?: number;
  adValorem?: number;
  icms?: number;
  veiculos?: string;
  capacidadeM3?: number;
  calculadora?: string;
  calculadoEm?: string;
  itens?: Array<{ iteId?: number; iteCodigo: string; iteDescricao: string; iteQuantidade: number; iteVolumeM3: number; iteReconhecido?: boolean }>;
};

export type City = { cidId: number; cidNome: string; cidUf: string; cidKm: number; cidAceitaCarreta: boolean; cidAtiva: boolean };
export type Product = { proId: number; proCodigo: string; proDescricao: string; proCategoria: string; proCoeficienteM3: number; proDimensoes: string; proAtivo: boolean; proDataCadastro?: string; proDataAtualizacao?: string };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isMultipart = init.body instanceof FormData;
  const headers = new Headers(init.headers || {});
  if (!isMultipart && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Erro HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  login: (email: string, password: string) => request<{ token: string; email: string; nome: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<{ email: string; nome: string }>("/auth/me"),
  dashboard: () => request<{ totalPedidos: number; rascunhos: number; calculados: number; enviados: number; pedidosRecentes: Order[] }>("/dashboard/summary"),
  orders: (params = "") => request<{ content: Order[]; totalElements: number; totalPages: number; number: number }>(`/orders${params ? `?${params}` : ""}`),
  order: (id: number) => request<Order>(`/orders/${id}`),
  createOrder: (body: { cliente: string; grupo: string; destino: string; valorCarga: number; itens: Array<{ codigo: string; descricao: string; quantidade: number }> }) => request<Order>("/orders", { method: "POST", body: JSON.stringify(body) }),
  updateOrder: (id: number, body: Record<string, unknown>) => request<Order>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  recalculate: (id: number) => request<Order>(`/orders/${id}/recalculate`, { method: "POST" }),
  deleteOrder: (id: number) => request<void>(`/orders/${id}`, { method: "DELETE" }),
  simulate: (body: { destino: string; valorCarga: number; tipoVeiculo: string; itens: Array<{ codigo: string; descricao: string; quantidade: number }> }) => request<{ destino: string; volumeM3: number; total: number; freteBase: number; pedagio: number; adValorem: number; icms: number; veiculos: string; capacidadeM3: number; calculadora: string }>("/freight/simulations", { method: "POST", body: JSON.stringify(body) }),
  cities: (search = "", active = false) => request<City[]>(`/cities?active=${active}&search=${encodeURIComponent(search)}`),
  createCity: (body: { nome: string; uf: string; km: number; aceitaCarreta: boolean; ativa: boolean }) => request<City>("/cities", { method: "POST", body: JSON.stringify(body) }),
  updateCity: (id: number, body: { nome: string; uf: string; km: number; aceitaCarreta: boolean; ativa: boolean }) => request<City>(`/cities/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  toggleCity: (id: number, value: boolean) => request<City>(`/cities/${id}/active?value=${value}`, { method: "PATCH" }),
  deleteCity: (id: number) => request<void>(`/cities/${id}`, { method: "DELETE" }),
  products: (search = "", active = false) => request<Product[]>(`/products?active=${active}&search=${encodeURIComponent(search)}`),
  createProduct: (body: { codigo: string; descricao: string; categoria: string; coeficienteM3: number; dimensoes: string; ativo: boolean }) => request<Product>("/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: number, body: { codigo: string; descricao: string; categoria: string; coeficienteM3: number; dimensoes: string; ativo: boolean }) => request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  toggleProduct: (id: number, value: boolean) => request<Product>(`/products/${id}/active?value=${value}`, { method: "PATCH" }),
  deleteProduct: (id: number) => request<void>(`/products/${id}`, { method: "DELETE" }),
  imports: () => request<any[]>("/imports"),
  uploadPdf: (file: File, cidade: string, valorFrete: string) => { const form = new FormData(); form.append("file", file); form.append("cidade", cidade); form.append("valorFrete", valorFrete); return request<any>("/imports/pdf", { method: "POST", body: form }); },
  uploadTariffs: (file: File) => { const form = new FormData(); form.append("file", file); return request<any>("/imports/tariffs", { method: "POST", body: form }); },
  uploadProducts: (file: File) => { const form = new FormData(); form.append("file", file); return request<any>("/imports/products", { method: "POST", body: form }); },
};

export const formatCurrency = (value?: number | null) => value == null ? "—" : Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const formatNumber = (value?: number | null, digits = 2) => value == null ? "—" : Number(value).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString("pt-BR") : "—";
export const formatDateTime = (value?: string) => value ? new Date(value).toLocaleString("pt-BR") : "—";
