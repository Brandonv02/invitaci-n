export const weddingConfig = {
  bride: "Digna",
  groom: "Brandon",
  date: "2026-11-21T00:00:00-05:00",
  venue: {
    ceremony: { name: "RANCHO ALTO - MIRADOR", address: "Después de Villalinda, vía San Pedro de los Milagros, 2 km, Bello, Antioquia", time: "4:00 p. m.", mapsUrl: "https://www.google.com/maps/search/?api=1&query=RANCHO%20ALTO%20-%20MIRADOR%2C%20Despu%C3%A9s%20de%20Villalinda%2C%20v%C3%ADa%20San%20Pedro%20de%20los%20Milagros%2C%202%20km%2C%20Bello%2C%20Antioquia" },
  },
  dressCode: "Elegante",
  whatsappNumber: "+573234731114",
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
