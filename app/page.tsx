"use client";

import { useState, useEffect } from "react";
import RadarDisplay from "@/components/radar-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, MapPin } from "lucide-react";

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataAge, setDataAge] = useState<number>(0);

  // Update data age every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdate) {
        const timeDiff = Math.floor(
          (Date.now() - new Date(lastUpdate).getTime()) / 1000
        );
        setDataAge(timeDiff);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Trigger refresh through the radar component
    window.dispatchEvent(
      new CustomEvent("refresh-radar", {
        detail: { timestamp: Date.now() },
      })
    );
  };

  return (
    <main className="w-full h-screen bg-linear-to-b from-slate-950 to-slate-900">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white">MRMS Radar</h1>
                <p className="text-sm text-slate-400">
                  Real-time Reflectivity at Lowest Altitude (RALA)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-mono text-slate-300">
                  {lastUpdate
                    ? new Date(lastUpdate).toLocaleTimeString()
                    : "Loading..."}
                </p>
                <p className="text-xs text-slate-500">
                  {dataAge > 0 && `${dataAge}s ago`}
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Main Radar Display */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1">
            <RadarDisplay onLastUpdateChange={setLastUpdate} />
          </div>

          {/* Side Panel */}
          <div className="w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto">
            <Card className="m-4 border-slate-700 bg-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Coverage Area
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <div>
                  <p className="text-slate-400 text-xs">Region</p>
                  <p className="font-mono">Continental US (CONUS)</p>
                  <p className="text-xs text-amber-400 mt-1">
                    ⚠️ US coverage only
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Resolution</p>
                  <p className="font-mono">~1 km</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Update Frequency</p>
                  <p className="font-mono">~2 minutes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="m-4 border-slate-700 bg-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white">
                  Reflectivity Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-300 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600" />
                    <span>&lt; 20 dBZ - Light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500" />
                    <span>20-30 dBZ - Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500" />
                    <span>30-40 dBZ - Heavy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500" />
                    <span>40-50 dBZ - Intense</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500" />
                    <span>&gt; 50 dBZ - Severe</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="m-4 border-slate-700 bg-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white">
                  Data Source
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-300">
                <p>
                  Data from NOAA MRMS (Multi-Radar Multi-Sensor) system. Updates
                  every ~2 minutes automatically. Refresh the page to load the
                  latest available data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
