// FinancialDashboard.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SurfaceGraphContainer from "./IVSurfaceGraph";
import NewsSearch from "./NewsSearch";
import RedditData from "./RedditData";


const FinancialDashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card className="col-span-2 row-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">News Search</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsSearch />
        </CardContent>
      </Card>

      <SurfaceGraphContainer strikeRange={[100, 350]} weeksRange={[0, 20]} />

      <Card className="col-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Reddit Data</CardTitle>
        </CardHeader>
        <CardContent>
          <RedditData />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;