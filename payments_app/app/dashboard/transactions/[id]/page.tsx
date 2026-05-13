import PaymentDetails from "../../../../components/ui/UniqueOperation";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-2xl">
        <PaymentDetails
          date="10 de Mayo de 2024"
          paymentMethod="Visa **** 0000"
          status="Pendiente de confirmacion"
          orderID="2347890237"
          subtotal="$50,300.00"
          shipping="$10,000.00"
          total="$60,300.00"
        />
      </div>
    </main>
  );
}