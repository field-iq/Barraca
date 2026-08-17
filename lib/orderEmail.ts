import { formatARS } from "./format";

export interface ResolvedOrderItem {
  name: string;
  dimensions: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ResolvedOrder {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  items: ResolvedOrderItem[];
  itemsSubtotal: number;
  delivery: {
    option: "delivery" | "pickup";
    description: string;
    cost: number;
  };
  total: number;
  createdAt: Date;
}

export function buildAdminOrderEmail(order: ResolvedOrder): string {
  return emailLayout(
    `Nuevo pedido ${order.orderId}`,
    `
      <p style="margin:0 0 18px;color:#3f2e22;font-size:16px;line-height:1.6">
        <strong>${escapeHtml(order.customer.name)}</strong> envió un pedido desde la tienda.
      </p>
      ${orderTable(order)}
      <div style="margin-top:24px;padding:18px;background:#f4f0e8;border-radius:6px;color:#3f2e22">
        <p style="margin:0 0 8px"><strong>Entrega:</strong> ${escapeHtml(order.delivery.description)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> <a href="mailto:${escapeAttribute(order.customer.email)}" style="color:#6b4f3a">${escapeHtml(order.customer.email)}</a></p>
        ${order.customer.phone ? `<p style="margin:0 0 8px"><strong>Teléfono:</strong> ${escapeHtml(order.customer.phone)}</p>` : ""}
        ${order.customer.notes ? `<p style="margin:0"><strong>Comentarios:</strong><br>${escapeHtml(order.customer.notes).replace(/\n/g, "<br>")}</p>` : ""}
      </div>
    `,
  );
}

export function buildCustomerOrderEmail(order: ResolvedOrder): string {
  return emailLayout(
    `Recibimos tu pedido ${order.orderId}`,
    `
      <p style="margin:0 0 18px;color:#3f2e22;font-size:16px;line-height:1.6">
        Hola ${escapeHtml(order.customer.name)}, gracias por elegir La Barraca De Juan.
        Recibimos tu pedido y nos pondremos en contacto para confirmar disponibilidad, entrega y forma de pago.
      </p>
      ${orderTable(order)}
      <p style="margin:18px 0 0;color:#6b4f3a;font-size:14px;line-height:1.6">
        <strong>Entrega:</strong> ${escapeHtml(order.delivery.description)}
      </p>
      <p style="margin:22px 0 0;color:#6b4f3a;font-size:14px;line-height:1.6">
        Este correo confirma la solicitud del pedido. No se realizó ningún cobro desde el sitio.
      </p>
    `,
  );
}

export function buildOrderText(order: ResolvedOrder, customerCopy: boolean): string {
  const lines = order.items.map(
    (item) =>
      `${item.quantity} x ${item.name} (${item.dimensions}) - ${formatARS(item.subtotal)}`,
  );
  const heading = customerCopy
    ? `Hola ${order.customer.name}. Recibimos tu pedido ${order.orderId}.`
    : `Nuevo pedido ${order.orderId} de ${order.customer.name}.`;

  return [
    heading,
    "",
    ...lines,
    "",
    `Entrega: ${order.delivery.description}`,
    order.delivery.cost > 0 ? `Costo de envío: ${formatARS(order.delivery.cost)}` : "",
    `Total en efectivo: ${formatARS(order.total)}`,
    `Email: ${order.customer.email}`,
    order.customer.phone ? `Teléfono: ${order.customer.phone}` : "",
    order.customer.notes ? `Comentarios: ${order.customer.notes}` : "",
    "",
    "La Barraca De Juan confirmará disponibilidad, entrega y forma de pago.",
  ]
    .filter(Boolean)
    .join("\n");
}

function orderTable(order: ResolvedOrder): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:13px 8px;border-bottom:1px solid #efe7da;vertical-align:top">
            <strong style="color:#3f2e22">${escapeHtml(item.name)}</strong><br>
            <span style="color:#7a6a5c;font-size:13px">${escapeHtml(item.dimensions)}</span>
          </td>
          <td style="padding:13px 8px;border-bottom:1px solid #efe7da;text-align:center;vertical-align:top">${item.quantity}</td>
          <td style="padding:13px 8px;border-bottom:1px solid #efe7da;text-align:right;vertical-align:top;white-space:nowrap">${formatARS(item.subtotal)}</td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;color:#3f2e22;font-size:14px">
      <thead>
        <tr style="background:#faf7f2;color:#6b4f3a">
          <th style="padding:10px 8px;text-align:left">Producto</th>
          <th style="padding:10px 8px;text-align:center">Cant.</th>
          <th style="padding:10px 8px;text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:14px 8px 0;text-align:right;color:#6b4f3a">Productos</td>
          <td style="padding:14px 8px 0;text-align:right;white-space:nowrap">${formatARS(order.itemsSubtotal)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px 8px 0;text-align:right;color:#6b4f3a">${order.delivery.option === "delivery" ? "Envío" : "Retiro"}</td>
          <td style="padding:8px 8px 0;text-align:right;white-space:nowrap">${order.delivery.cost > 0 ? formatARS(order.delivery.cost) : "Sin cargo"}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:16px 8px 0;text-align:right;font-weight:bold">Total en efectivo</td>
          <td style="padding:16px 8px 0;text-align:right;font-size:20px;font-weight:bold;white-space:nowrap">${formatARS(order.total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function emailLayout(title: string, content: string): string {
  return `<!doctype html>
  <html lang="es">
    <body style="margin:0;padding:0;background:#f5f4f1;font-family:Arial,sans-serif">
      <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(title)}</div>
      <table role="presentation" style="width:100%;border-collapse:collapse">
        <tr><td style="padding:28px 14px">
          <table role="presentation" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #efe7da">
            <tr><td style="padding:24px;background:#3f2e22;color:#faf7f2">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:22px">La Barraca De Juan</p>
              <p style="margin:0;color:#e8ded2;font-size:13px">Muebles artesanales</p>
            </td></tr>
            <tr><td style="padding:26px 24px">
              <h1 style="margin:0 0 20px;color:#3f2e22;font-family:Georgia,serif;font-size:25px;font-weight:normal">${escapeHtml(title)}</h1>
              ${content}
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
