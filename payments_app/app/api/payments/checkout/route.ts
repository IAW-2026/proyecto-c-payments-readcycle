import { MercadoPagoConfig, Preference } from 'mercadopago';
import { authenticateRequest } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    const authResult = await authenticateRequest(request, {
      apiKeyEnvName: "CHECKOUT_API_KEY",
      virtualUserRole: UserRole.BUYER,
      allowedRoles: [UserRole.BUYER, UserRole.ADMIN],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const data = await request.json();
    const { items, buyerId, sellerId, orderId, successUrl, failureUrl } = data;

    if (!items || !buyerId || !sellerId || !successUrl || !failureUrl) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos (items, buyerId, sellerId, successUrl, failureUrl)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener la URL de notificación (webhook)
    const webhookSecret = process.env.MP_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    const secretQuery = webhookSecret ? `?secret=${webhookSecret}` : "";
    
    let finalNotificationUrl = process.env.MP_WEBHOOK_URL || process.env.WEBHOOK_URL;
    if (!finalNotificationUrl) {
      // Si no viene en el request ni en variables de entorno, la construimos dinámicamente usando la URL de la petición actual
      const requestUrl = new URL(request.url);
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host;
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      const detectedProtocol = host.includes('localhost') ? 'http' : proto;
      const defaultBaseUrl = `${detectedProtocol}://${host}`;
      finalNotificationUrl = `${defaultBaseUrl}/api/payments/checkout/mpHook${secretQuery}`;
    } else {
      // Si viene de variables de entorno, aseguramos que tenga el secret anexado
      if (webhookSecret && !finalNotificationUrl.includes('secret=')) {
        const separator = finalNotificationUrl.includes('?') ? '&' : '?';
        finalNotificationUrl = `${finalNotificationUrl}${separator}secret=${webhookSecret}`;
      }
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: successUrl
        },
        auto_return: 'approved',
        metadata: {
          buyer_id: buyerId,
          seller_id: sellerId,
          order_id: orderId || `ORDER-${Date.now()}`
        },
        // Solo enviamos notification_url a Mercado Pago si es HTTPS
        notification_url: finalNotificationUrl && finalNotificationUrl.startsWith('https') ? finalNotificationUrl : undefined,
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