"use client"
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StyledTradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }

    if (!containerRef.current) return;

    const config = {
      width: "100%",
      height: "1000",
      defaultColumn: "overview",
      defaultScreen: "most_capitalized",
      showToolbar: true,
      locale: "en",
      market: "us",
      colorTheme: "dark",
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setIsLoading(false);
    script.innerHTML = JSON.stringify(config);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
    scriptRef.current = script;

    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full p-4">
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden relative">
        <CardContent className="p-6">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 p-6">
              <Skeleton className="h-[1000px] w-full " />
            </div>
          )}
          
          <div
            className="tradingview-widget-container w-full h-[1000px]"
            style={{ opacity: isLoading ? 0 : 1 }}
          >
            <div
              className="tradingview-widget-container__widget"
              ref={containerRef}
            />
            {/* <div className="tradingview-widget-copyright mt-2 text-sm text-white/60">
              Powered by{" "}
              <a
                href="https://www.tradingview.com/"
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                TradingView
              </a>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyledTradingViewWidget;