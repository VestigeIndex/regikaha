"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import type { Professional } from "@/lib/types";
import { coordinatesForProfessional, primaryCategoryName, professionalMarkerKind } from "@/lib/geo";

export function RegiKahaMap({
  professionals,
  selectedId,
  onSelect,
}: {
  professionals: Professional[];
  selectedId?: string | null;
  onSelect?: (professional: Professional) => void;
}) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!elementRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !elementRef.current) return;
      const map = L.map(elementRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([43.5, 6.8], 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function renderMarkers() {
      const map = mapRef.current;
      const group = layerRef.current;
      if (!map || !group) return;
      const L = await import("leaflet");
      if (cancelled) return;
      group.clearLayers();
      const bounds: [number, number][] = [];
      professionals.forEach((professional, index) => {
        const coords = coordinatesForProfessional(professional, index);
        bounds.push([coords.lat, coords.lng]);
        const selected = professional.id === selectedId;
        const kind = professionalMarkerKind(professional);
        const initials = professional.publicName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();
        const icon = L.divIcon({
          className: "",
          html: `<span class="rk-map-marker${selected ? " is-selected" : ""}" data-kind="${kind}">${initials}</span>`,
          iconSize: selected ? [42, 42] : [34, 34],
          iconAnchor: selected ? [21, 21] : [17, 17],
        });
        const marker = L.marker([coords.lat, coords.lng], { icon });
        marker.bindTooltip(
          `<strong>${professional.publicName}</strong><br>${primaryCategoryName(professional)}<br>${professional.city || professional.serviceArea}`,
          { direction: "top", offset: [0, -14], opacity: 0.96 },
        );
        marker.on("click", () => onSelect?.(professional));
        marker.addTo(group);
      });
      if (bounds.length === 1) map.setView(bounds[0], 11);
      else if (bounds.length > 1) map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8 });
      else map.setView([43.5, 6.8], 4);
    }
    renderMarkers();
    return () => {
      cancelled = true;
    };
  }, [onSelect, professionals, selectedId]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl bg-canvas-alt">
      <div ref={elementRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-xl bg-white/92 px-3 py-2 text-xs font-medium text-ink shadow-soft ring-1 ring-forest-600/10">
        Leaflet + OpenStreetMap
      </div>
    </div>
  );
}
