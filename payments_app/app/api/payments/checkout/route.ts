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
    const { items, buyerId, sellerId, orderId, returnUrl, baseUrl } = data;

    if (!items || !buyerId || !sellerId || !returnUrl) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos (items, buyerId, sellerId, returnUrl)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener dinámicamente la URL base de nuestro servidor (payments_app)
    const requestUrl = new URL(request.url);
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host;
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    
    // Si estamos en localhost, forzar http si el proto detectado no coincide
    const detectedProtocol = host.includes('localhost') ? 'http' : proto;
    const defaultBaseUrl = `${detectedProtocol}://${host}`;
    
    // Priorizamos siempre la URL de nuestro propio servidor detectada, y usamos baseUrl como fallback secundario
    const serverBaseUrl = defaultBaseUrl || baseUrl;

    const preference = new Preference(client);

    // Construir la URL de notificación del webhook de forma dinámica usando la URL base detectada
    const webhookSecret = process.env.MP_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    const secretQuery = webhookSecret ? `?secret=${webhookSecret}` : "";
    const notificationUrl = `${serverBaseUrl}/api/payments/checkout/mpHook${secretQuery}`;

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