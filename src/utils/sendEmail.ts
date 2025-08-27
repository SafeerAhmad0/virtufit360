import emailjs from '@emailjs/browser';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface SendOrderEmailParams {
  name: string;
  email: string;
  address: string;
  items: OrderItem[];
  total: number;
}

export async function sendOrderEmail({ 
  name, 
  email, 
  address, 
  items, 
  total 
}: SendOrderEmailParams): Promise<void> {
  try {
    console.log('Sending order confirmation to:', email);
    console.log('Order details:', { name, address, items, total });
    
    const order_id = Math.floor(Math.random() * 1000000); // Simple random order ID
    const templateParams = {
      email: email,
      to_name: name,
      from_name: 'VirtuFit360',
      address,
      order_id: order_id,
      orders: items.map(item => ({ name: item.name, units: item.quantity, price: item.price, image: item.image })),
      cost: {
        shipping: 0,
        total: total
      },
      total: total,
      date: new Date().toLocaleDateString()
    };

    await emailjs.send(
      'service_f72xppf',    // TODO: Replace with your EmailJS service ID
      'template_2k1jvxo',   // TODO: Replace with your EmailJS template ID
      templateParams,
      '4gtWWpbvs-ZIzHxVB'     // TODO: Replace with your EmailJS public key
    );
  } catch (error) {
    console.error('Failed to send order email:', error, JSON.stringify(error, null, 2));
    throw new Error('Failed to send order confirmation email');
  }
}

export async function sendContactEmail({ name, email, title, message, time }: { name: string, email: string, title: string, message: string, time: string }): Promise<void> {
  try {
    const templateParams = {
      name,
      title,
      message,
      time,
      email
    };
    await emailjs.send(
      'service_f72xppf',
      'template_s6xpbr8',
      templateParams,
      '4gtWWpbvs-ZIzHxVB'
    );
  } catch (error) {
    console.error('Failed to send contact email:', error);
    throw new Error('Failed to send contact email');
  }
}
