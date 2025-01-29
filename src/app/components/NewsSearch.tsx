// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { motion, AnimatePresence } from "framer-motion";
// import React, { useState, useEffect, useCallback } from "react";

// interface NewsItem {
//   title: string;
//   content: string;
//   url: string;
// }

// const NewsSearch: React.FC = () => {
//   const [ticker, setTicker] = useState<string>("AAPL");
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [activeIndex, setActiveIndex] = useState<number>(0);
//   const [direction, setDirection] = useState<number>(1);

//   const fetchNews = useCallback(async (searchTicker: string) => {
//     if (searchTicker === "" || searchTicker == null || searchTicker.length > 6) {
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/news-search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ticker: searchTicker }),
//       });
//       const data = await response.json();
//       setNews(data.news || []);
//       setActiveIndex(0);
//     } catch (error) {
//       console.error("Error fetching news:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Auto-rotation effect
//   useEffect(() => {
//     if (news.length > 1) {
//       const interval = setInterval(() => {
//         setActiveIndex((prev) => (prev + 1) % news.length);
//       }, 10000);
//       return () => clearInterval(interval);
//     }
//   }, [news.length]);

//   // Load initial AAPL news
//   useEffect(() => {
//     fetchNews("AAPL");
//   }, [fetchNews]);

//   const handleSearch = () => {
//     fetchNews(ticker);
//   };

//   const handleNext = () => {
//     setDirection(1);
//     setActiveIndex((prev) => (prev + 1) % news.length);
//   };

//   const handlePrev = () => {
//     setDirection(-1);
//     setActiveIndex((prev) => (prev - 1 + news.length) % news.length);
//   };

//   return (
//     <div className="space-y-4 relative">
//       <div className="flex space-x-2">
//         <Input
//           type="text"
//           value={ticker}
//           onChange={(e) => setTicker(e.target.value.toUpperCase())}
//           placeholder="Enter stock ticker"
//         />
//         <Button onClick={handleSearch} disabled={isLoading}>
//           {isLoading ? "Searching..." : "Search News"}
//         </Button>
//       </div>

//       <div className="relative h-96">
//         <AnimatePresence initial={false} custom={direction}>
//           {news.length > 0 && (
//             <motion.div
//               key={activeIndex}
//               custom={direction}
//               initial={{ opacity: 0, y: direction * 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -direction * 50 }}
//               transition={{ duration: 0.5 }}
//               className="absolute w-full"
//             >
//               <Card className="w-full h-full flex flex-col border-none">
//                 <CardHeader>
//                   <CardTitle className="text-lg">
//                     {news[activeIndex].title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-grow">
//                   <p className="text-sm">{news[activeIndex].content}</p>
//                 </CardContent>
//                 {news[activeIndex].url && (
//                   <div className="p-4 mt-auto">
//                     <a
//                       href={news[activeIndex].url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline text-sm"
//                     >
//                       Read more
//                     </a>
//                   </div>
//                 )}
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {news.length > 1 && (
//         <div className="flex justify-center space-x-4">
//           <Button variant="outline" onClick={handlePrev}>
//             Previous
//           </Button>
//           <Button variant="outline" onClick={handleNext}>
//             Next
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewsSearch;

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";

interface NewsItem {
  title: string;
  content: string;
  url: string;
}

const NewsSearch: React.FC = () => {
  const [ticker, setTicker] = useState<string>("AAPL");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const fetchNews = useCallback(async (searchTicker: string) => {
    if (searchTicker === "" || searchTicker == null || searchTicker.length > 6) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/news-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: searchTicker }),
      });
      const data = await response.json();
      setNews(data.news || []);
      setActiveIndex(0);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % news.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [news.length]);

  useEffect(() => {
    fetchNews("AAPL");
  }, [fetchNews]);

  const handleSearch = () => {
    fetchNews(ticker);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % news.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="relative">
        <Input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter stock ticker (e.g., AAPL)"
          className="pl-4 pr-32 h-12 text-lg rounded-xl shadow-sm"
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-0 top-0 h-12 px-6 rounded-r-xl bg-blue-600 hover:bg-black-700 ml-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Search className="w-5 h-5 mr-2" />
          )}
          Search News
        </Button>
      </div>

      <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AnimatePresence initial={false} custom={direction}>
          {news.length > 0 && (
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="absolute inset-0"
            >
              <Card className="h-full border-none bg-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold leading-tight">
                    {news[activeIndex].title.replace("*", "").replace("#", "")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full overflow-y-auto">
                  <p className="text-base leading-relaxed opacity-90">
                    {news[activeIndex].content.replace("*", "").replace("#", "")}
                  </p>
                  {news[activeIndex].url && (
                    <motion.a
                      href={news[activeIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Read full article →
                    </motion.a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {news.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSearch;