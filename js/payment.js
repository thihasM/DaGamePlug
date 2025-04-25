document.getElementById('embeddedPaymentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const expiryInput = document.getElementById('embedded-expiry').value;
  const errorMessage = document.getElementById('embedded-error-message');
  errorMessage.textContent = '';


  const [expMonth, expYear] = expiryInput.split('/');
  if (!expMonth || !expYear || isNaN(expMonth) || isNaN(expYear)) {
    errorMessage.textContent = 'Invalid expiry date format.';
    return;
  }

  const now = new Date();
  const inputMonth = parseInt(expMonth, 10);
  const inputYear = parseInt('20' + expYear, 10); 

  const expiryDate = new Date(inputYear, inputMonth);
  const currentDate = new Date(now.getFullYear(), now.getMonth() + 1); 

  if (expiryDate <= currentDate) {
    errorMessage.textContent = 'Card expiry date must be in the future.';
    return;
  }
 const today = new Date();
  const deliveryOffset = Math.floor(Math.random() * 7) + 1;// gen  ran num  1 & 7 for del
  // Calc del 
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryOffset);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Dateform = deliveryDate.toLocaleDateString(undefined, options);

  alert(`your Payment successful! Thank you for shopping with da game plug.\nExpected Delivery Date: ${Dateform}`);

  localStorage.removeItem('cart');
  window.location.href = "index.html";
});