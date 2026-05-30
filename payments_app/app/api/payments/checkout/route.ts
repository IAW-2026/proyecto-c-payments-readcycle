import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { items, buyerId, sellerId, orderId, returnUrl, baseUrl } = data;

    if (!items || !buyerId || !sellerId || !returnUrl || !baseUrl) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos (items, buyerId, sellerId, returnUrl, baseUrl)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const preference = new Preference(client);

    // Construir la URL de notificación del webhook de forma dinámica usando el baseUrl recibido
    const webhookSecret = process.env.MP_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    const secretQuery = webhookSecret ? `?secret=${webhookSecret}` : "";
    const notificationUrl = `${baseUrl}/api/payments/checkout/mpHook${secretQuery}`;

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        back_urls: {
          success: returnUrl,
          failure: returnUrl,
          pending: returnUrl
        },
        auto_return: 'approved',
        metadata: {
          buyer_id: buyerId,
          seller_id: sellerId,
          order_id: orderId || `ORDER-${Date.now()}`
        },
        // Solo enviamos notification_url a Mercado Pago si es HTTPS
        notification_url: notificationUrl.startsWith('https') ? notificationUrl : undefined,
      }
    });

    return new Response(JSON.stringify({ id: result.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error("Error creating Mercado Pago preference:", error);

    let message = "Error al crear la preferencia de pago";
    let details = null;

    if (error && typeof error === 'object') {
      message = error.message || message;
      // Extraer detalles de error del SDK de Mercado Pago
      if (error.response) {
        details = error.response;
      } else if (error.cause) {
        details = error.cause;
      }
    }

    return new Response(JSON.stringify({
      error: message,
      details: details
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}