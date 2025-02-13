// FinancialDashboard.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SurfaceGraphContainer from "./IVSurfaceGraph";
import NewsSearch from "./NewsSearch";
import RedditData from "./RedditData";
import CongressTrading from "./CongressTrading";
import CorporateLobbying from "./CorporateLobbying";


const FinancialDashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card className="col-span-2 row-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-black">News Search</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsSearch />
        </CardContent>
      </Card>

      <SurfaceGraphContainer strikeRange={[100, 350]} weeksRange={[0, 20]} />

      <Card className="col-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-black">Reddit Data</CardTitle>
        </CardHeader>
        <CardContent>
          <RedditData />
        </CardContent>
      </Card>

      <Card className="col-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-black">Congressional Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <CongressTrading />
        </CardContent>
      </Card>

      <Card className="col-span-4 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-black">Corporate Lobbying</CardTitle>
        </CardHeader>
        <CardContent>
          <CorporateLobbying />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;