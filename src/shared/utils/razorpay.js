const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loading = null;

/** Injects the Razorpay checkout script once and resolves when ready. */
export function loadRazorpay() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in a browser'));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => {
      loading = null;
      reject(new Error('Could not load the payment gateway. Check your connection.'));
    };
    document.body.appendChild(script);
  });

  return loading;
}

/**
 * Opens Razorpay checkout and resolves with the payment result.
 * @returns {Promise<{razorpay_payment_id:string, razorpay_order_id:string, razorpay_signature:string}>}
 */
export async function openRazorpay({ key, amount, currency, orderId, name, description, prefill }) {
  const Razorpay = await loadRazorpay();

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: Math.round(amount * 100),
      currency,
      name: name || 'Ticket Panda',
      description: description || 'Event ticket',
      order_id: orderId,
      prefill,
      theme: { color: '#F97316' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    };

    const checkout = new Razorpay(options);
    checkout.on('payment.failed', (response) =>
      reject(new Error(response?.error?.description || 'Payment failed')),
    );
    checkout.open();
  });
}

export default { loadRazorpay, openRazorpay };
