"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface RadarDisplayProps {
  onLastUpdateChange: (timestamp: string) => void;
}

export default function RadarDisplay({
  onLastUpdateChange,
}: RadarDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const radarLayer = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainer.current) return;

      try {
        const Leaflet = (await import("leaflet")).default;
        // Import CSS (TypeScript will complain but it works at runtime)
        // @ts-ignore
        await import("leaflet/dist/leaflet.css");

        if (!isMounted) return;

        map.current = Leaflet.map(mapContainer.current, {
          center: [39.8, -95.583],
          zoom: 4,
          preferCanvas: true,
        });

        Leaflet.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; CartoDB contributors",
            maxZoom: 19,
            className: "grayscale",
          }
        ).addTo(map.current);

        const fetchRadar = async () => {
          try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/radar-data");
            if (!response.ok) {
              throw new Error("Failed to fetch radar data");
            }

            const data = await response.json();

            if (data.error) {
              throw new Error(data.error);
            }

            if (radarLayer.current && map.current) {
              map.current.removeLayer(radarLayer.current);
            }

            if (map.current && data.tile_url) {
              radarLayer.current = Leaflet.tileLayer(data.tile_url, {
                opacity: 0.7,
                maxZoom: 19,
                minZoom: 0,
              }).addTo(map.current);

              onLastUpdateChange(data.timestamp);
            }

            setIsLoading(false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setIsLoading(false);
          }
        };

        await fetchRadar();

        const refreshInterval = setInterval(() => {
          if (map.current) {
            fetchRadar();
          }
        }, 120000);

        const handleRefresh = () => {
          fetchRadar();
        };
        window.addEventListener("refresh-radar", handleRefresh);

        return () => {
          clearInterval(refreshInterval);
          window.removeEventListener("refresh-radar", handleRefresh);
        };
      } catch (err) {
        console.error("Failed to initialize map:", err);
        setError("Failed to load map library");
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ background: "#0f172a" }}
      />

      {isLoading && (
        <div className="absolute top-4 left-4 bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">
              Loading radar data...
            </span>
          </div>
        </div>
      )}

      {error && (
        <Card className="absolute bottom-4 left-4 border-red-700 bg-red-950 max-w-xs">
          <div className="p-3">
            <p className="text-sm font-semibold text-red-200">Error</p>
            <p className="text-xs text-red-300 mt-1">{error}</p>
            <p className="text-xs text-red-400 mt-2">
              Check console for details or try again later.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
