// payment.js
document.getElementById('paymentForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Payment successful! Thank you for shopping with us.');
  window.location.href = "index.html"; // Redirect hoe
  localStorage.removeItem('cart');//leave cart empty after payment
});
