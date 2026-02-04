export function buildWhatsappLink(
  whatsappNumber: string,
  productName: string,
  price: string,
  productUrl: string
) {
  const message = `Hello! I'm interested in ${productName} (Price: ${price}). Product link: ${productUrl}`;
  const encoded = encodeURIComponent(message);
  const phone = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encoded}`;
}
