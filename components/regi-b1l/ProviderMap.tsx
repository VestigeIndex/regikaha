"use client";

import { useEffect, useRef } from "react";
import type { Provider } from "@/lib/regi-b1l/types";
import styles from "./RegiB1L.module.css";

export function ProviderMap({ providers }: { providers: Provider[] }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    const element = host.current;
    void import("leaflet").then((L) => {
      if (cancelled || !element || element.dataset.ready) return;
      element.dataset.ready = "true";
      map = L.map(element, { zoomControl: true, scrollWheelZoom: false }).setView([40.42, -3.68], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<span style="display:grid;place-items:center;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#0b6c50;color:white;border:2px solid white;box-shadow:0 2px 8px #2448"><b style="transform:rotate(45deg);font-size:11px">B1</b></span>', iconSize: [30, 30], iconAnchor: [15, 28] });
      const bounds = L.latLngBounds([]);
      providers.forEach((provider) => {
        L.marker([provider.lat, provider.lng], { icon }).addTo(map!).bindPopup(`<strong>${provider.name}</strong><br>${provider.address}`);
        bounds.extend([provider.lat, provider.lng]);
      });
      if (providers.length > 1) map.fitBounds(bounds.pad(.22));
    });
    return () => { cancelled = true; map?.remove(); if (element) delete element.dataset.ready; };
  }, [providers]);

  return <div ref={host} className={styles.map} />;
}
