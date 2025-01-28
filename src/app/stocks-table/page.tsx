'use client'

import { useEffect, useRef } from 'react'

interface TradingViewConfig {
  width: string
  height: string
  defaultColumn: string
  defaultScreen: string
  showToolbar: boolean
  locale: string
  market: string
  colorTheme: string
}

export default function TradingViewStockScreener() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Cleanup previous script if it exists
    if (scriptRef.current?.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current)
    }

    // Skip if container ref is not available
    if (!containerRef.current) return

    const config: TradingViewConfig = {
      width: '100%',
      height: '100%',
      defaultColumn: 'overview',
      defaultScreen: 'most_capitalized',
      showToolbar: true,
      locale: 'en',
      market: 'us',
      colorTheme: 'light'
    }

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify(config)

    // Clear container and append new script
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)
    scriptRef.current = script

    // Cleanup function
    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [])

  return (
    <div className="tradingview_stock_screener_div h-[1000px]">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" ref={wrapperRef} />
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="blue-text">Track all markets</span>
          </a>{' '}
          on TradingView
        </div>
      </div>
    </div>
  )
}