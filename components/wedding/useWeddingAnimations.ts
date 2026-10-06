"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const EASE_SOFT = "power3.out";
const EASE_TEXT = "expo.out";

/**
 * Coreografía de toda la invitación. Se apoya en atributos data-* del marcado:
 *  data-split        → título que aparece letra a letra desde una máscara
 *  data-words-scrub  → frase que se "ilumina" palabra a palabra al hacer scroll
 *  data-fade         → elemento que sube y aparece (en grupo, escalonado)
 *  data-parallax="n" → elemento que se desplaza a otra velocidad (n = intensidad)
 *  data-bg-parallax  → sección cuyo fondo se mueve más lento que el contenido
 *  data-magnetic     → botón que sigue suavemente al cursor
 * Todo queda desactivado si la persona prefiere reducir el movimiento.
 */
export function useWeddingAnimations(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, scope.current);

      // ── Barra de progreso dorada ───────────────────────────────
      gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } });

      // ── Entrada del sobre al cargar ────────────────────────────
      gsap.timeline({ defaults: { ease: EASE_SOFT } })
        .from(".hero-top", { y: -18, autoAlpha: 0, duration: 1.1 })
        .from(".letter-envelope", { scale: 0.93, y: 30, autoAlpha: 0, filter: "blur(10px)", duration: 1.6, clearProps: "filter" }, 0.1)
        .from(".envelope-label", { y: 16, autoAlpha: 0, letterSpacing: "0.6em", duration: 1.2 }, 0.6)
        .from(".envelope-address", { y: 22, autoAlpha: 0, duration: 1.2 }, 0.75)
        .from(".envelope-seal", { scale: 0, rotate: -120, duration: 1.4, ease: "elastic.out(1, 0.55)" }, 0.95)
        .from([".envelope-hint", ".scroll-cue", ".hero-side-note"], { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.12 }, 1.5)
        .to(".envelope-seal", { scale: 1.05, duration: 1.5, ease: "sine.inOut", repeat: -1, yoyo: true }, 2.5);

      // ── Apertura: nombres, pareja y pétalos acompañan al sobre ─
      const heroName = SplitText.create(".hero h1", { type: "words,chars", charsClass: "split-char", mask: "chars" });
      gsap.timeline({ scrollTrigger: { trigger: ".hero-track", start: "top top", end: "bottom bottom", scrub: 0.8 } })
        .fromTo(".hero-couple-stage", { scale: 0.84, y: 30 }, { scale: 1, y: 0, ease: "none", duration: 0.75 }, 0.1)
        .from(".hero-pretitle", { autoAlpha: 0, letterSpacing: "0.9em", duration: 0.25 }, 0.4)
        .from(heroName.chars, { yPercent: 120, rotate: 8, stagger: 0.022, duration: 0.25, ease: "power2.out" }, 0.45)
        .from(".hero-subtitle", { autoAlpha: 0, y: 14, letterSpacing: "0.9em", duration: 0.2 }, 0.75)
        .fromTo(".petals", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.45)
        .set({}, {}, 1);

      // ── Títulos letra a letra ──────────────────────────────────
      all("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "words,chars", charsClass: "split-char", mask: "chars", autoSplit: true,
          onSplit: (self) => gsap.from(self.chars, {
            yPercent: 115, rotate: 7, duration: 1.2, ease: EASE_TEXT, stagger: 0.028,
            scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" }
          })
        });
      });

      // ── Frase que se ilumina palabra a palabra ─────────────────
      all("[data-words-scrub]").forEach((el) => {
        SplitText.create(el, {
          type: "words", wordsClass: "split-word", autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.words,
            { opacity: 0.12, filter: "blur(4px)", y: 8 },
            { opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.1, ease: "none",
              scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 } })
        });
      });

      // ── Aparición escalonada genérica ──────────────────────────
      gsap.set("[data-fade]", { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch("[data-fade]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE_SOFT, stagger: 0.12, overwrite: true }),
        onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y: 34, duration: 0.5, overwrite: true })
      });

      // ── Líneas doradas que se dibujan desde el centro ──────────
      all(".gold-rule").forEach((el) => {
        gsap.from(el, { scaleX: 0, duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });

      // ── Parallax de elementos decorativos y fondos ─────────────
      all("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 1;
        gsap.fromTo(el, { y: -60 * depth, rotate: -6 * depth }, {
          y: 60 * depth, rotate: 6 * depth, ease: "none",
          scrollTrigger: { trigger: el.closest("section") ?? el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });
      all("[data-bg-parallax]").forEach((el) => {
        gsap.fromTo(el, { "--bg-y": "-70px" }, { "--bg-y": "70px", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // ── Historia: el texto entra con profundidad ───────────────
      gsap.from(".story-last", { autoAlpha: 0, y: 20, filter: "blur(6px)", duration: 1.4, ease: EASE_SOFT, scrollTrigger: { trigger: ".story-last", start: "top 88%", toggleActions: "play none none reverse" } });

      // ── Fecha: el día cuenta hasta su número ───────────────────
      const day = document.querySelector<HTMLElement>(".date-day");
      if (day) {
        const target = Number(day.textContent) || 0;
        const counter = { v: 0 };
        gsap.timeline({ scrollTrigger: { trigger: ".date-lockup", start: "top 82%", toggleActions: "play none none reverse" } })
          .from(day, { autoAlpha: 0, scale: 0.7, filter: "blur(12px)", duration: 1.6, ease: EASE_TEXT, clearProps: "filter" }, 0)
          .fromTo(counter, { v: 0 }, { v: target, duration: 1.8, ease: "power2.out", onUpdate: () => { day.textContent = String(Math.round(counter.v)).padStart(2, "0"); } }, 0)
          .from(".date-month", { autoAlpha: 0, letterSpacing: "1.2em", duration: 1.4, ease: EASE_SOFT }, 0.35)
          .from(".date-year", { autoAlpha: 0, y: 24, duration: 1.2, ease: EASE_SOFT }, 0.55);
      }

      // ── Cuenta atrás: los números se voltean al entrar ─────────
      gsap.from(".count-unit", {
        autoAlpha: 0, y: 50, rotateX: -80, transformPerspective: 600, transformOrigin: "50% 100%",
        duration: 1.2, ease: "back.out(1.6)", stagger: 0.12,
        scrollTrigger: { trigger: ".countdown", start: "top 88%", toggleActions: "play none none reverse" }
      });

      // ── Tarjeta de ceremonia: se revela como una carta ─────────
      gsap.timeline({ scrollTrigger: { trigger: ".venue-card", start: "top 85%", toggleActions: "play none none reverse" } })
        .fromTo(".venue-card", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" })
        .from(".venue-card > *", { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1, ease: EASE_SOFT }, 0.7)
        .from(".venue-mark", { rotate: -180, scale: 0, duration: 1.2, ease: "back.out(2)" }, 0.9);

      // ── Recepción: la línea vertical se dibuja con el scroll ───
      gsap.fromTo(".reception-line", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: ".reception-section", start: "top 85%", end: "top 35%", scrub: 0.5 } });

      // ── Vestimenta ─────────────────────────────────────────────
      gsap.from(".dress-icon", { scale: 0, rotate: -200, duration: 1.5, ease: "elastic.out(1, 0.5)", scrollTrigger: { trigger: ".dress-icon", start: "top 88%", toggleActions: "play none none reverse" } });

      // ── RSVP: destello que gira con el scroll ──────────────────
      gsap.to(".rsvp-sparkle", { rotate: 360, ease: "none", scrollTrigger: { trigger: ".rsvp-section", start: "top bottom", end: "bottom top", scrub: 1 } });

      // ── Cierre: la pareja aparece como un recuerdo ─────────────
      gsap.from(".closing .couple-art", { autoAlpha: 0, scale: 0.82, y: 40, filter: "blur(10px)", duration: 1.8, ease: EASE_TEXT, clearProps: "filter", scrollTrigger: { trigger: ".closing", start: "top 75%", toggleActions: "play none none reverse" } });

      // ── Toque sutil: cada sección se "asienta" al entrar ───────
      all<HTMLElement>(".section > div").forEach((el) => {
        gsap.fromTo(el, { scale: 0.97 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "top 30%", scrub: true } });
      });
    });

    // ── Botones magnéticos (solo con mouse) ──────────────────────
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups = gsap.utils.toArray<HTMLElement>("[data-magnetic]", scope.current).map((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const leave = () => { xTo(0); yTo(0); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
      });

      // Inclinación 3D de la tarjeta de ceremonia
      const card = scope.current?.querySelector<HTMLElement>(".venue-card");
      let tiltCleanup = () => {};
      if (card) {
        const rx = gsap.quickTo(card, "rotateX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotateY", { duration: 0.8, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 900 });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        tiltCleanup = () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
      }
      return () => { cleanups.forEach((fn) => fn()); tiltCleanup(); };
    });
  }, { scope });
}
