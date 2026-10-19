import { useEffect, useState } from "react";
import {
  Trash2,
  Truck,
  RotateCcw,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

import {
  api,
  formatCurrency,
  formatDateTime,
  formatNumber,
  Order,
  Product,
  City,
} from "../../lib/api";

import type { Screen } from "../App";

interface OrderDetailProps {
  orderId: number | null;
  onNavigate: (screen: Screen, id?: number) => void;
}

interface OrderItemForm {
  codigo: string;
  descricao: string;
  quantidade: number;
}

export function OrderDetail({
  orderId,
  onNavigate,
}: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [form, setForm] = useState({
    cliente: "",
    grupo: "",
    destino: "",
    valorCarga: "",
  });

  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.products("", true)
      .then(setProducts)
      .catch(() => {
        setProducts([]);
      });

    api.cities("", true)
      .then(setCities)
      .catch(() => {
        setCities([]);
      });

    if (orderId) {
      api.order(orderId)
        .then(setOrder)
        .catch((err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar pedido"
          );
        });
    } else {
      setOrder(null);
    }
  }, [orderId]);

  const parseCurrency = (value: string) => {
    const normalized = value
      .replace(/[^0-9,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
  };

  const create = async () => {
    setError("");

    if (!form.cliente.trim()) {
      setError("Informe o cliente.");
      return;
    }

    if (!form.grupo.trim()) {
      setError("Informe o grupo.");
      return;
    }

    if (!form.destino.trim()) {
      setError("Selecione o destino.");
      return;
    }

    if (parseCurrency(form.valorCarga) <= 0) {
      setError("Informe um valor de carga maior que zero.");
      return;
    }

    if (orderItems.length === 0) {
      setError("Adicione pelo menos um item ao pedido.");
      return;
    }

    setLoading(true);

    try {
      const created = await api.createOrder({
        cliente: form.cliente,
        grupo: form.grupo,
        destino: form.destino,
        valorCarga: parseCurrency(form.valorCarga),
        itens: orderItems,
      });

      setOrder(created);
      onNavigate("order-detail", created.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar o pedido"
      );
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm("Excluir este pedido?");

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteOrder(order.id);
      onNavigate("orders");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o pedido"
      );
    }
  };

  const recalc = async () => {
    if (!order) {
      return;
    }

    try {
      const recalculated = await api.recalculate(order.id);
      setOrder(recalculated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível recalcular o pedido"
      );
    }
  };

  const addItem = () => {
    const firstProduct = products[0];

    if (!firstProduct) {
      setError(
        "Nenhum produto ativo foi encontrado no catálogo."
      );
      return;
    }

    setOrderItems((currentItems) => [
      ...currentItems,
      {
        codigo: firstProduct.proCodigo,
        descricao: firstProduct.proDescricao,
        quantidade: 1,
      },
    ]);
  };

  const updateItemProduct = (
    index: number,
    codigo: string
  ) => {
    const selectedProduct = products.find(
      (product) => product.proCodigo === codigo
    );

    setOrderItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              codigo,
              descricao:
                selectedProduct?.proDescricao ||
                item.descricao,
            }
          : item
      )
    );
  };

  const updateItemQuantity = (
    index: number,
    quantidade: number
  ) => {
    setOrderItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantidade,
            }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    setOrderItems((currentItems) =>
      currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const existing = Boolean(order);

  return (
    <div
      className="flex-1 p-8 overflow-y-auto"
      style={{ background: "#0D1117" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate("orders")}
          className="p-1.5 rounded transition-colors hover:bg-[#161B22]"
        >
          <ArrowLeft size={16} color="#8B949E" />
        </button>

        <h1
          className="text-2xl font-bold"
          style={{ color: "#E6EDF3" }}
        >
          {existing
            ? `Pedido #${order?.proposta}`
            : "Novo Pedido"}
        </h1>
      </div>

      {error && (
        <p
          className="mb-3 text-sm"
          style={{ color: "#F85149" }}
        >
          {error}
        </p>
      )}

      {!existing ? (
        <div
          className="max-w-2xl rounded-lg border p-5"
          style={{
            background: "#161B22",
            borderColor: "#30363D",
          }}
        >
          <h3
            className="text-sm font-semibold uppercase mb-4"
            style={{ color: "#8B949E" }}
          >
            Dados do pedido
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <label
              className="text-xs"
              style={{ color: "#8B949E" }}
            >
              Cliente

              <input
                value={form.cliente}
                onChange={(event) =>
                  setForm({
                    ...form,
                    cliente: event.target.value,
                  })
                }
                className="mt-1 w-full rounded px-3 py-2"
                style={{
                  background: "#0D1117",
                  border: "1px solid #30363D",
                  color: "#E6EDF3",
                }}
              />
            </label>

            <label
              className="text-xs"
              style={{ color: "#8B949E" }}
            >
              Grupo

              <input
                value={form.grupo}
                onChange={(event) =>
                  setForm({
                    ...form,
                    grupo: event.target.value,
                  })
                }
                className="mt-1 w-full rounded px-3 py-2"
                style={{
                  background: "#0D1117",
                  border: "1px solid #30363D",
                  color: "#E6EDF3",
                }}
              />
            </label>

            <label
              className="text-xs"
              style={{ color: "#8B949E" }}
            >
              Destino

              <select
                value={form.destino}
                onChange={(event) =>
                  setForm({
                    ...form,
                    destino: event.target.value,
                  })
                }
                className="mt-1 w-full rounded px-3 py-2"
                style={{
                  background: "#0D1117",
                  border: "1px solid #30363D",
                  color: "#E6EDF3",
                }}
              >
                <option value="">
                  Selecione uma cidade
                </option>

                {cities.map((city) => (
                  <option
                    key={city.cidId}
                    value={`${city.cidNome} - ${city.cidUf}`}
                  >
                    {city.cidNome} - {city.cidUf}
                  </option>
                ))}
              </select>
            </label>

            <label
              className="text-xs"
              style={{ color: "#8B949E" }}
            >
              Valor da carga

              <input
                value={form.valorCarga}
                onChange={(event) =>
                  setForm({
                    ...form,
                    valorCarga: event.target.value,
                  })
                }
                placeholder="Ex.: 20000 ou 20.000,00"
                className="mt-1 w-full rounded px-3 py-2"
                style={{
                  background: "#0D1117",
                  border: "1px solid #30363D",
                  color: "#E6EDF3",
                }}
              />
            </label>
          </div>

          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <h3
                className="text-sm font-semibold"
                style={{ color: "#8B949E" }}
              >
                Itens
              </h3>

              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs"
                style={{ color: "#F0A500" }}
              >
                <Plus size={13} />
                Adicionar
              </button>
            </div>

            {orderItems.length === 0 && (
              <p
                className="text-xs mb-3"
                style={{ color: "#8B949E" }}
              >
                Nenhum item adicionado.
              </p>
            )}

            {orderItems.map((item, index) => (
              <div
                key={`${item.codigo}-${index}`}
                className="flex gap-2 mb-2"
              >
                <select
                  value={item.codigo}
                  onChange={(event) =>
                    updateItemProduct(
                      index,
                      event.target.value
                    )
                  }
                  className="flex-1 rounded px-2"
                  style={{
                    background: "#0D1117",
                    color: "#E6EDF3",
                    border: "1px solid #30363D",
                  }}
                >
                  {products.map((product) => (
                    <option
                      key={product.proCodigo}
                      value={product.proCodigo}
                    >
                      {product.proCodigo} —{" "}
                      {product.proDescricao}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(event) =>
                    updateItemQuantity(
                      index,
                      Number(event.target.value)
                    )
                  }
                  className="w-16 rounded px-2"
                  style={{
                    background: "#0D1117",
                    color: "#E6EDF3",
                    border: "1px solid #30363D",
                  }}
                />

                <button
                  onClick={() => removeItem(index)}
                  className="p-1"
                >
                  <X size={14} color="#F85149" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={create}
            disabled={loading}
            className="mt-5 px-4 py-2 rounded font-semibold disabled:opacity-50"
            style={{
              background: "#F0A500",
              color: "#000",
            }}
          >
            {loading
              ? "Criando..."
              : "Criar e calcular pedido"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div
              className="rounded-lg border p-5"
              style={{
                background: "#161B22",
                borderColor: "#30363D",
              }}
            >
              <div className="flex justify-between">
                <strong style={{ color: "#E6EDF3" }}>
                  {order?.proposta}
                </strong>

                <span
                  className="text-xs"
                  style={{ color: "#388BFD" }}
                >
                  {order?.status}
                </span>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Cliente", order?.cliente],
                  ["Grupo", order?.grupo],
                  ["Destino", order?.destino],
                  [
                    "Valor da carga",
                    formatCurrency(order?.valorCarga),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between"
                  >
                    <dt style={{ color: "#8B949E" }}>
                      {label}
                    </dt>

                    <dd style={{ color: "#E6EDF3" }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: "#161B22",
                borderColor: "#30363D",
              }}
            >
              <div
                className="px-5 py-3"
                style={{ color: "#8B949E" }}
              >
                Itens do pedido
              </div>

              <table className="w-full">
                <tbody>
                  {(order?.itens || []).map((item: any) => (
                    <tr
                      key={item.iteId}
                      className="border-t"
                      style={{ borderColor: "#30363D" }}
                    >
                      <td
                        className="px-4 py-2 text-xs"
                        style={{ color: "#E6EDF3" }}
                      >
                        {item.iteCodigo}
                      </td>

                      <td
                        className="px-4 py-2 text-xs"
                        style={{ color: "#E6EDF3" }}
                      >
                        {item.iteDescricao}
                      </td>

                      <td
                        className="px-4 py-2 text-xs"
                        style={{ color: "#E6EDF3" }}
                      >
                        {item.iteQuantidade}
                      </td>

                      <td
                        className="px-4 py-2 text-xs"
                        style={{ color: "#E6EDF3" }}
                      >
                        {formatNumber(item.iteVolumeM3)} m³
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={remove}
              className="flex items-center justify-center gap-2 py-2 rounded text-sm w-full"
              style={{
                background: "#F85149",
                color: "white",
              }}
            >
              <Trash2 size={14} />
              Excluir Pedido
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="rounded-lg p-5 border"
              style={{
                background: "#161B22",
                borderColor: "#F0A500",
              }}
            >
              <p
                className="text-xs uppercase"
                style={{ color: "#8B949E" }}
              >
                Valor Total do Frete
              </p>

              <p
                className="text-4xl font-bold my-2"
                style={{
                  color: "#F0A500",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {formatCurrency(order?.valorFrete)}
              </p>

              <p
                className="text-xs"
                style={{ color: "#8B949E" }}
              >
                {order?.calculadora || "FAST Frete"} ·{" "}
                {formatDateTime(order?.calculadoEm)}
              </p>
            </div>

            <div
              className="rounded-lg p-5 border flex gap-4"
              style={{
                background: "#161B22",
                borderColor: "#30363D",
              }}
            >
              <Truck color="#8B949E" />

              <div>
                <p style={{ color: "#E6EDF3" }}>
                  {order?.veiculos || "Não informado"}
                </p>

                <p
                  className="text-xs"
                  style={{ color: "#8B949E" }}
                >
                  {order?.capacidadeM3 || 0} m³ de capacidade
                </p>
              </div>
            </div>

            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: "#161B22",
                borderColor: "#30363D",
              }}
            >
              <div
                className="px-5 py-3"
                style={{ color: "#8B949E" }}
              >
                Detalhamento Financeiro
              </div>

              {[
                ["Frete Base", order?.freteBase],
                ["Pedágio", order?.pedagio],
                ["Ad Valorem", order?.adValorem],
                ["ICMS", order?.icms],
                ["Total", order?.valorFrete],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="flex justify-between px-5 py-2 border-t text-sm"
                  style={{
                    borderColor: "#30363D",
                    color:
                      label === "Total"
                        ? "#F0A500"
                        : "#E6EDF3",
                  }}
                >
                  <span>{label}</span>

                  <span>
                    {formatCurrency(value as number)}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={recalc}
              className="flex items-center justify-center gap-2 py-2 rounded text-sm"
              style={{
                border: "1px solid #30363D",
                color: "#E6EDF3",
              }}
            >
              <RotateCcw size={14} />
              Recalcular
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
