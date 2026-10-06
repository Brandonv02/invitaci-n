export const weddingConfig = {
  bride: "Digna",
  groom: "Brandon",
  date: "2026-11-22T00:00:00-05:00",
  venue: {
    ceremony: { name: "Centro Comercial Premium Plaza", address: "Cra. 43A # 30-25, Av. El Poblado con Calle 30, Medellín, Antioquia", time: "Por confirmar", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%20Comercial%20Premium%20Plaza%2C%20Cra.%2043A%20%23%2030-25%2C%20Av.%20El%20Poblado%20con%20Calle%2030%2C%20Medell%C3%ADn%2C%20Antioquia" },
    reception: { name: "Xalisco Rooftop", address: "Cra. 63b #70 52, Goretti, Bello, Antioquia", time: "Por confirmar", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Xalisco%20Rooftop%2C%20Cra.%2063b%20%2370%2052%2C%20Goretti%2C%20Bello%2C%20Antioquia" },
  },
  dressCode: "Elegante",
  whatsappNumber: "[NÚMERO CON CÓDIGO DE PAÍS]",
  musicPath: "/audio/cant-help-falling-in-love.mp3",
  coupleImagePath: "/images/couple-cartoon.png"
} as const;

export const weddingDate = new Date(weddingConfig.date);
export function mapsLink(url: string, address: string) {
  if (url.startsWith("https://") && !url.includes("[")) return url;
  if (address.includes("[")) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
export function whatsappLink() {
  const number = weddingConfig.whatsappNumber.replace(/\D/g, "");
  const message = `Hola, quiero confirmar mi asistencia a la boda de ${weddingConfig.bride} y ${weddingConfig.groom}.`;
  return number.length >= 8 && !weddingConfig.whatsappNumber.includes("[")
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}
