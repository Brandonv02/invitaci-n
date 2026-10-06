"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { weddingConfig, weddingDate, mapsLink, whatsappLink } from "@/lib/wedding-config";
import SmoothScroll, { scrollToY } from "./SmoothScroll";
import Petals from "./Petals";
import Envelope from "./Envelope";
import { useWeddingAnimations } from "./useWeddingAnimations";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`section-inner ${className}`}>{children}</div>;
}
function Couple({ compact = false }: { compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={`couple-art ${compact ? "couple-art--small" : ""}`}>
    {!failed ? <Image src={weddingConfig.coupleImagePath} alt={`Ilustración de ${weddingConfig.bride} y ${weddingConfig.groom}`} fill sizes={compact ? "220px" : "(max-width: 600px) 80vw, 420px"} priority={!compact} onError={() => setFailed(true)} className="couple-image" /> : null}
    {failed && <div className="couple-placeholder" aria-label="Espacio reservado para la ilustración de la pareja"><span>{weddingConfig.bride[0]} <i>&</i> {weddingConfig.groom[0]}</span><small>LA ILUSTRACIÓN DE LOS NOVIOS<br />VIVIRÁ AQUÍ</small></div>}
  </div>;
}
function Sprig({ className, depth, flip = false }: { className: string; depth: number; flip?: boolean }) {
  return <svg className={`sprig ${className}`} data-parallax={depth} viewBox="0 0 120 220" aria-hidden="true"><g transform={flip ? "matrix(-1 0 0 1 120 0)" : undefined}><path d="M60 215C58 160 64 100 52 8" /><path d="M58 170c-18-6-30-20-32-38 16 4 28 18 32 38zM59 128c18-8 30-22 31-40-16 5-28 20-31 40zM56 88c-16-6-26-18-28-34 14 4 25 16 28 34zM55 50c14-7 23-18 24-32-13 4-22 15-24 32z" /></g></svg>;
}
function MiniEnvelope({ className }: { className: string }) {
  return <svg className={`mini-envelope ${className}`} viewBox="0 0 64 44" aria-hidden="true"><rect x="1" y="1" width="62" height="42" rx="2" className="mini-envelope-body" /><path d="M1 43 26 22M63 43 38 22" className="mini-envelope-line" /><path d="M1 1 32 26 63 1Z" className="mini-envelope-flap" /><circle cx="32" cy="25" r="5.5" className="mini-envelope-seal" /></svg>;
}
function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => { const track = new Audio(weddingConfig.musicPath); track.loop = true; setAudio(track); }, []);
  async function toggle() {
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); return; }
    try { await audio.play(); setPlaying(true); setAvailable(true); }
    catch { setAvailable(false); setPlaying(false); }
  }
  return <button className="music-toggle" onClick={toggle} aria-label={playing ? "Pausar música" : "Activar música"} title={available ? (playing ? "Pausar música" : "Activar música") : `Añade la canción en public${weddingConfig.musicPath}`}>{playing ? "Ⅱ" : "♫"}</button>;
}
function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const remaining = now === null ? 0 : Math.max(0, weddingDate.getTime() - now);
  if (now !== null && remaining === 0) return <p className="today-message">Hoy comienza nuestro para siempre.</p>;
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="countdown" aria-label="Cuenta regresiva"><div>{values.map((v, i) => <div className="count-unit" key={i}><strong key={i === 3 ? v : undefined} className={i === 3 ? "tick" : undefined}>{String(v).padStart(2, "0")}</strong><span>{["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][i]}</span></div>)}</div></div>;
}
export default function Experience() {
  const heroTrack = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  useWeddingAnimations(mainRef);
  useEffect(() => {
    const track = heroTrack.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = Math.max(1, track.offsetHeight - window.innerHeight);
        const progress = reduceMotion.matches ? 1 : Math.max(0, Math.min(1, (window.scrollY - track.offsetTop) / distance));
        const open = Math.max(0, Math.min(1, (progress - 0.12) / 0.62));
        track.style.setProperty("--envelope-open", String(open));
        track.style.setProperty("--envelope-rotation", `${open * -180}deg`);
        track.style.setProperty("--envelope-lift", `${open * -34}px`);
        track.style.setProperty("--couple-reveal", String(0.38 + open * 0.62));
        track.style.setProperty("--cue-before", String(1 - open));
        track.style.setProperty("--cue-after", String(open));
        document.querySelector<HTMLElement>(".envelope-echo")?.style.setProperty("opacity", String(open * 0.09));
        const envelopeButton = track.querySelector<HTMLButtonElement>(".envelope-seal");
        if (envelopeButton) envelopeButton.style.pointerEvents = open < 0.96 ? "auto" : "none";
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduceMotion.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);
  const dateParts = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "2-digit", month: "long", year: "numeric", weekday: "long" }).formatToParts(weddingDate);
  const datePart = (type: Intl.DateTimeFormatPartTypes) => dateParts.find((part) => part.type === type)?.value ?? "";
  const date = `${datePart("day")} · ${datePart("month").toUpperCase()} · ${datePart("year")}`;
  function openEnvelope() {
    const track = heroTrack.current;
    if (!track) return;
    const travel = Math.max(0, track.offsetHeight - window.innerHeight);
    const openPosition = track.offsetTop + travel * 0.86;
    scrollToY(openPosition);
  }
  const { ceremony, reception } = weddingConfig.venue;
  const ceremonyMap = mapsLink(ceremony.mapsUrl, ceremony.address);
  const placeholder = (value: string) => value.includes("[");
  return <main ref={mainRef}>
    <SmoothScroll />
    <div className="scroll-progress" aria-hidden="true" />
    <Petals />
    <MusicToggle />
    <div className="envelope-echo" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="2.5" y="2.5" width="95" height="95" /><path d="M2.5 2.5 L50 18 L97.5 2.5 M2.5 97.5 L50 72 L97.5 97.5" /></svg></div>
    <div className="hero-track" id="inicio" ref={heroTrack}>
    <section className="hero">
      <div className="hero-top eyebrow">NUESTRA HISTORIA <span>·</span> UNA INVITACIÓN</div>
      <div className="hero-ring" aria-hidden="true">✳</div>
      <div className="hero-couple-stage"><Couple /></div>
      <Envelope onOpen={openEnvelope} />
      <div className="hero-copy"><p className="hero-pretitle">CON ALEGRÍA EN EL CORAZÓN</p>
      <h1>{weddingConfig.bride}<span className="ampersand"> & </span>{weddingConfig.groom}</h1>
      <p className="hero-subtitle">NOS CASAMOS</p></div>
      <div className="scroll-cue"><span aria-hidden="true">↓</span><span className="cue-before">DESLIZA PARA ABRIR</span><span className="cue-after">SIGUE DESCUBRIENDO</span></div>
      <div className="hero-side-note">{date}</div>
    </section>
    </div>
    <section className="story section" id="historia" data-bg-parallax><Sprig className="sprig--left" depth={1.2} /><Sprig className="sprig--right" depth={0.7} flip /><Reveal><p className="eyebrow" data-fade>TODO COMENZÓ CON UN ENCUENTRO</p><span className="gold-rule" /><h2 data-words-scrub>Hay historias que comienzan sin saber<br className="desktop-break" /> que algún día se convertirán en un para siempre.</h2><p className="story-last">Y esta es la nuestra.</p></Reveal></section>
    <section className="date-section section"><Reveal><p className="eyebrow" data-fade>CON TODO NUESTRO AMOR</p><h2 className="display-title" data-split>Nuestra boda</h2><div className="date-lockup"><span className="date-day">{datePart("day")}</span><span className="date-month">{datePart("month").toUpperCase()}</span><span className="date-year">{datePart("year")}</span></div><span className="gold-rule" /><p className="eyebrow" data-fade>{datePart("weekday").toUpperCase()} · {date}</p><p className="save-date" data-fade>Guarda esta fecha</p></Reveal></section>
    <section className="count-section section"><Reveal><p className="eyebrow" data-fade>CADA VEZ MÁS CERCA</p><h2 className="display-title" data-split>La cuenta atrás</h2><Countdown /></Reveal></section>
    <section className="venue-section section" id="ceremonia"><Reveal><p className="eyebrow" data-fade>NOS ENCANTARÁ CELEBRAR CONTIGO</p><h2 className="display-title" data-split>Ceremonia</h2><div className="venue-card"><span className="venue-mark" aria-hidden="true">✳</span><h3>{ceremony.name}</h3><p>{ceremony.address}</p><p className="venue-time">{ceremony.time}</p>{ceremonyMap ? <a className="outline-button" href={ceremonyMap} target="_blank" rel="noreferrer" data-magnetic>VER UBICACIÓN <span>↗</span></a> : <span className="outline-button" aria-disabled="true">UBICACIÓN PENDIENTE</span>}</div></Reveal></section>
    <section className="reception-section section" id="recepcion"><Reveal><div className="reception-line" /><p className="eyebrow" data-fade>Y DESPUÉS, CELEBREMOS</p><h2 className="display-title" data-split>Recepción</h2><p className="reception-place" data-fade>{reception.name}</p><p data-fade>{reception.address}</p><p className="venue-time" data-fade>{reception.time}</p>{mapsLink(reception.mapsUrl, reception.address) && <a className="text-link" href={mapsLink(reception.mapsUrl, reception.address)} target="_blank" rel="noreferrer" data-fade>CÓMO LLEGAR ↗</a>}</Reveal></section>
    <section className="dress-section section"><Reveal><p className="eyebrow" data-fade>PARA UNA OCASIÓN ESPECIAL</p><span className="dress-icon" aria-hidden="true">♧</span><h2 className="eyebrow dress-label" data-fade>CÓDIGO DE VESTIMENTA</h2><p className="dress-title" data-split>{weddingConfig.dressCode}</p><span className="gold-rule" /><p className="muted" data-fade>Celebremos juntos con elegancia.</p></Reveal></section>
    <section className="gift-section section"><Reveal><div className="gift-rain" aria-hidden="true"><MiniEnvelope className="mini-envelope--a" /><MiniEnvelope className="mini-envelope--b" /><MiniEnvelope className="mini-envelope--c" /></div><p className="eyebrow" data-fade>UN DETALLE DE AMOR</p><h2 className="display-title" data-split>Lluvia de sobres</h2><p className="gift-lead" data-fade>Tu compañía es el regalo que más nos importa.</p><span className="gold-rule" /><p className="gift-text" data-fade>Si deseas contribuir a nuestro nuevo comienzo, tendremos disponible la opción de lluvia de sobres.</p></Reveal></section>
    <section className="rsvp-section section" data-bg-parallax><Sprig className="sprig--rsvp" depth={1} /><Reveal><span className="rsvp-sparkle" aria-hidden="true">✳</span><p className="eyebrow" data-fade>TE ESPERAMOS CON MUCHA ILUSIÓN</p><h2 data-split>Queremos compartir<br />este día contigo.</h2><p data-fade>Confirma tu asistencia.</p><a className="solid-button" href={whatsappLink()} target="_blank" rel="noreferrer" data-fade data-magnetic>CONFIRMAR ASISTENCIA <span>↗</span></a></Reveal></section>
    <footer className="closing section"><Reveal><Couple compact /><p className="eyebrow" data-fade>GRACIAS POR FORMAR PARTE</p><h2 data-split>de nuestra historia.</h2><p className="closing-names" data-split>{weddingConfig.bride}<span> & </span>{weddingConfig.groom}</p><span className="gold-rule" /><p className="muted" data-fade>Nos vemos en nuestro gran día.</p><p className="closing-date" data-fade>{date}</p></Reveal></footer>
  </main>;
}
