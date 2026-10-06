import { weddingConfig } from "@/lib/wedding-config";

/**
 * Convierte un polígono (en %) en un clip-path con bordes irregulares,
 * como papel de algodón rasgado a mano. Es determinista para que el
 * servidor y el navegador generen exactamente la misma forma.
 */
function deckled(points: [number, number][], seed: number, steps = 110, amp = 0.16) {
  let n = seed;
  const rand = () => { n = (n * 9301 + 49297) % 233280; return n / 233280; };
  const out: string[] = [];
  points.forEach(([x1, y1], i) => {
    const [x2, y2] = points[(i + 1) % points.length];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    // Los bordes que quedan fuera de la pantalla no necesitan textura
    const rough = !(y1 < 0 && y2 < 0) && !(y1 > 100 && y2 > 100);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const j = rough && s > 0 ? (rand() - 0.5) * 2 * amp * (rand() > 0.9 ? 1.7 : 1) : 0;
      out.push(`${(x1 + (x2 - x1) * t + nx * j).toFixed(2)}% ${(y1 + (y2 - y1) * t + ny * j).toFixed(2)}%`);
    }
  });
  return `polygon(${out.join(",")})`;
}

const TOP_FLAP = deckled([[1, -1], [99, -1], [50, 51]], 11);
const BOTTOM_FLAP = deckled([[50, 46], [98, 101], [2, 101]], 29);

function SealBouquet() {
  return <svg className="seal-bouquet" viewBox="6 2 48 68" aria-hidden="true">
    <defs>
      <path id="seal-petal" d="M0-1.6C2.2-3.8 2.3-7 0-8.6-2.3-7-2.2-3.8 0-1.6Z" />
      <g id="seal-flower"><use href="#seal-petal" /><use href="#seal-petal" transform="rotate(72)" /><use href="#seal-petal" transform="rotate(144)" /><use href="#seal-petal" transform="rotate(216)" /><use href="#seal-petal" transform="rotate(288)" /><circle r="1.7" /></g>
      <g id="seal-art">
        {/* tallos que se juntan en un lazo */}
        <path fill="none" d="M22 24C25 36 28 44 29 52M38 22C35 34 32 44 31 52M30 33V52M17 36C22 42 26 47 29 52M44 36C39 42 34 47 31 52M28 54 26 66M30 54V67M32 54 34 66" />
        {/* lazo */}
        <path d="M30 52C25 48 20 50 22 54 24 57 28 55 30 52ZM30 52C35 48 40 50 38 54 36 57 32 55 30 52ZM29 53 25 60M31 53 35 60" />
        {/* hojas */}
        <path d="M24 42C18 40 14 42 12 46 17 48 21 46 24 42ZM24 42 15 45.5M36 42C42 40 46 42 48 46 43 48 39 46 36 42ZM36 42 45 45.5M27 30C24 27 20 27 18 28 20 31 24 32 27 30ZM33 30C36 27 40 27 42 28 40 31 36 32 33 30Z" />
        {/* flores */}
        <use href="#seal-flower" transform="translate(30 20) scale(1.25)" />
        <use href="#seal-flower" transform="translate(19 25) scale(.95) rotate(20)" />
        <use href="#seal-flower" transform="translate(41 24) scale(1) rotate(-15)" />
        <use href="#seal-flower" transform="translate(24 10) scale(.75) rotate(40)" />
        <use href="#seal-flower" transform="translate(37 10) scale(.7) rotate(10)" />
        {/* botones */}
        <path d="M14 34C11 31 11 28 13 26 16 28 16 31 14 34ZM46 34C49 31 49 28 47 26 44 28 44 31 46 34Z" />
      </g>
    </defs>
    <use href="#seal-art" className="seal-shadow" transform="translate(.6 .8)" />
    <use href="#seal-art" className="seal-light" />
  </svg>;
}

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const { bride, groom } = weddingConfig;
  return <div className="opening-layer">
    <div className="letter-envelope">
      <span className="envelope-flap envelope-flap--bottom" aria-hidden="true"><span className="flap-paper" style={{ clipPath: BOTTOM_FLAP }} /></span>
      <span className="envelope-flap envelope-flap--top" aria-hidden="true"><span className="flap-paper" style={{ clipPath: TOP_FLAP }} /></span>
      <span className="envelope-heading"><span className="envelope-label">UNA INVITACIÓN PARA TI</span><span className="envelope-address">{bride} & {groom}</span></span>
      <button className="envelope-seal" type="button" onClick={onOpen} aria-label={`Abrir la invitación de ${bride} y ${groom}`}><SealBouquet /></button>
      <span className="envelope-hint">TOCA EL SELLO PARA ABRIR</span>
    </div>
  </div>;
}
