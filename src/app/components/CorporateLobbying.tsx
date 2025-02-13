"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// We'll re-use the type from the route. If this file doesn't share the type, 
// you can duplicate the interface or import it from a shared file.
type CongressionalTrading = {
  id: number
  ticker: string
  date: string
  issue: string
  amount: string
};

export default function CorporateLobbying() {
  const [tradingData, setTradingData] = useState<CongressionalTrading[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/corporate-lobbying");
      if (!response.ok) {
        console.error("Error fetching data" + response);
        return;
      }
      const data: CongressionalTrading[] = await response.json();
      setTradingData(data);
    };
    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradingData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.ticker}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.issue}</TableCell>
            <TableCell>{item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}