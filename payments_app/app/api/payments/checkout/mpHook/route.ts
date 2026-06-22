import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { TransactionStatus } from "@prisma/client";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

function mapMpStatus(status: string): TransactionStatus {
  switch (status?.toLowerCase()) {
    case "approved":
      return TransactionStatus.APPROVED;
    case "rejected":
      return TransactionStatus.REJECTED;
    case "cancelled":
      return TransactionStatus.CANCELLED;
    case "refunded":
      return TransactionStatus.REFUNDED;
    case "pending":
    case "in_process":
    default:
      return TransactionStatus.PENDING;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const clientSecret = searchParams.get('secret');
    const webhookSecret = process.env.MP_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;

    if (webhookSecret && clientSecret !== webhookSecret) {
      console.warn("Intento de webhook no autorizado: las claves secretas no coinciden.");
      return NextResponse.json(
        {
          error: "Unauthorized: Webhook secret mismatch",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    console.log("Mercado Pago Webhook Body:", body);

    if (body.type !== "payment") {
      return NextResponse.json({
        ignored: true,
      });
    }

    const paymentId = body.data.id;
    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({
      id: paymentId,
    });

    const metadata = payment.metadata || {};
    const buyerId = metadata.buyer_id || metadata.buyerId;
    const sellerId = metadata.seller_id || metadata.sellerId;
    const orderId = metadata.order_id || metadata.orderId || `ORDER-${payment.id}`;

    if (!buyerId || !sellerId) {
      return NextResponse.json(
        {
          error: "Missing buyerId or sellerId in payment metadata",
        },
        {
          status: 400,
        }
      );
    }

    const transactionStatus = mapMpStatus(payment.status!);

    const transaction = await prisma.transaction.upsert({
      where: {
        mercadoPagoPaymentId: payment.id!.toString(),
      },

      update: {
        status: transactionStatus,
      },

      create: {
        buyerId: buyerId,
        sellerId: sellerId,
        mercadoPagoPaymentId: payment.id!.toString(),
        mercadoPagoPreferenceId: (payment as any).preference_id || null,
        orderId: orderId,
        amount: Number(payment.transaction_amount),
        status: transactionStatus,
        paymentMethod: payment.payment_method_id,
      },
    });

    // Forward transaction notification to seller's webhook
    const sellerWebhookUrl = process.env.SELLER_WEBHOOK;
    const sellerApiKey = process.env.SELLER_API_KEY;

    if (sellerApiKey && sellerWebhookUrl) {
      try {
        console.log(`Forwarding transaction ${transaction.id} notification to seller's webhook...`);
        const forwardPayload = {
          id: transaction.id,
          paymentId: transaction.id,
          orderId: transaction.orderId,
          status: transaction.status.toLowerCase(),
        };

        const response = await fetch(sellerWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": sellerApiKey,
            "Authorization": `Bearer ${sellerApiKey}`,
          },
          body: JSON.stringify(forwardPayload),
        });

        const responseText = await response.text();
        console.log(`Seller webhook response status: ${response.status}`);
        console.log(`Seller webhook response body: ${responseText}`);
      } catch (forwardError) {
        console.error("Failed to forward transaction notification to seller's webhook:", forwardError);
      }
    } else {
      console.warn("SELLER_API_KEY or SELLER_WEBHOOK is not defined in env variables. Skipping forwarding notification.");
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Webhook error",
      },
      {
        status: 500,
      }
    );
  }
}