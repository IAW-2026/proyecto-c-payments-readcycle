[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ks7Ywtwc)
# payments

Aplicación **Payments** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión ReadCycle.

Esta app corresponde al módulo de pagos en los proyectos de tipo **A (Transporte)**, **B (Delivery)** y **C (Marketplace)**.

---

## Deploy

La aplicación está disponible en: [Vercel](https://proyecto-c-payments-readcycle-nlqt.vercel.app/)

---

## Credenciales de prueba

### Usuario comprador

- Email: buyer+clerk_test@iaw.com
- Contraseña: iawuser#

### Usuario vendedor

- Email: seller+clerk_test@iaw.com
- Contraseña: iawuser#

### Administrador

- Email: admin+clerk_test@iaw.com
- Contraseña: iawuser#

### Usuario comprador (MercadoPago)

- User: TESTUSER8668260087551210480
- Contraseña: P2IqX1nn9q
- Codigo: 514692

### Usuario vendedor (MercadoPago)

- User: TESTUSER7413073599988108579
- Contraseña: Dar5CWpvHU
- Codigo: 514690

---

## Instrucciones extra

- La aplicacion simula una compra entre 2 usuarios reales por 26.000 pesos y envia a la persona a mercado pago. Esta simulacion se da ya que necesitariamos la aplicacion Buyer para que nos de datos, pero para probar que funciona la compra existe esta simulacion.
- La aplicacion funciona a la perfeccion EN LOCAL exepto por la parte de mercado pago. Esto es porque mercado pago necesita links reales a los que acceder para las operaciones. En el caso de probar mercado pago se recomienda hacerlo en el deploy, o caso contrario, utilizar DevTunnels de VsCode para hacer port forwarding del entorno local para que mercado pago pueda llegar a el.
- Al intentar una compra en mercado pago, utilizar el usuario comprador dado previamente. Tenga en cuenta que esa cuenta de prueba tiene cerca de 200.000 pesos que bajan por cada operacion que se hace. Tambien tenga en cuenta que si desea utilizar las tarjetas, estas tienen clave 123 o 1234 para AMEX. Las tarjetas de credito de prueba no generan operaciones en la base de datos.
- Aunque las operaciones se ven reflejadas en la base de datos, usted puede entrar a mercado pago desde el navegador con cualquiera de las cuentas de vendedor (mp) o comprador (mp) y revisar que las operaciones son reales.

---

## Descripción

La aplicacion de pagos ReadCycle presenta un HUB donde se pueden revisar todas las operaciones que ofrece la plataforma.
Nuestros usuarios pueden revisar las transacciones y disputas dentro de el HUB o acceder a verlas en detalle o en su totalidad. Tambien pueden generar disputas sobre transacciones creadas o generar nuevas transacciones.
Los administradores del sitio no tienen un panel como tal ya que la aplicacion en si es un panel, por esto, la aplicacion para el admin se mantiene igual pero con agregados para las operaciones que le corresponden

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
