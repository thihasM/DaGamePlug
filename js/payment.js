// payment.js
document.getElementById('paymentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const today = new Date();
  const deliveryOffset = Math.floor(Math.random() * 7) + 1;
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryOffset);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = deliveryDate.toLocaleDateString(undefined, options);

  alert(`Payment successful! Thank you for shopping with us.\nExpected Delivery Date: ${formattedDate}`);

  localStorage.removeItem('cart');
  window.location.href = "index.html";
});

