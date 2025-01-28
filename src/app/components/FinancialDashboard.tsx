"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SurfaceGraphContainer from "./IVSurfaceGraph";
import NewsSearch from "./NewsSearch";
import OptionsMatrixHeapMapv2 from "./OptionsMatrixHeatMap2";
import RedditData from "./RedditData";

const bestTrades = [
  { id: 1, symbol: "AAPL", action: "Buy", price: 150.25, return: "5.2%" },
  { id: 2, symbol: "GOOGL", action: "Sell", price: 2750.8, return: "3.1%" },
  { id: 3, symbol: "MSFT", action: "Buy", price: 305.15, return: "2.8%" },
];

const FinancialDashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* Latest News Card - Spans 2 columns */}
      {/* <Card className="col-span-2 row-span-4">
        <CardHeader>
          <CardTitle>Latest Financial News</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <ul className="space-y-4">
              <li>
                <h3 className="font-semibold">Market Rally Continues</h3>
                <p className="text-sm text-muted-foreground">
                  The S&P 500 reached new highs today as tech stocks surged...
                </p>
              </li>
              <li>
                <h3 className="font-semibold">
                  Federal Reserve Announces Policy Change
                </h3>
                <p className="text-sm text-muted-foreground">
                  In a surprise move, the Fed signaled a shift in its approach
                  to inflation...
                </p>
              </li>
              <li>
                <h3 className="font-semibold">Earnings Season Kicks Off</h3>
                <p className="text-sm text-muted-foreground">
                  Major banks are set to report earnings this week, setting the
                  tone for...
                </p>
              </li>
            </ul>
          </ScrollArea>
        </CardContent>
      </Card> */}
      <Card className="col-span-2 row-span-4">
        <CardHeader>
          <CardTitle>News Search</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsSearch />
        </CardContent>
      </Card>

      <SurfaceGraphContainer strikeRange={[100, 350]} weeksRange={[0, 20]} />
      {/* <VolatilityGraph/> */}

      {/* Best Trades Table Card - Spans full width */}
      {/* <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Best Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.action}</TableCell>
                  <TableCell>${trade.price.toFixed(2)}</TableCell>
                  <TableCell>{trade.return}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Reddit Data</CardTitle>
        </CardHeader>
        <CardContent>
          <RedditData />
        </CardContent>
      </Card>

      <OptionsMatrixHeapMapv2 isComponent={false} />
    </div>
  );
};

export default FinancialDashboard;
