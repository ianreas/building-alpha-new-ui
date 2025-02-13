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
  politican_name: string
  politician_party: string
  transaction_type: string
  disclosed_date: string
};

export default function CongressTrading() {
  const [tradingData, setTradingData] = useState<CongressionalTrading[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/congress-trading");
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
          <TableHead>Politician Name</TableHead>
          <TableHead>Party</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Disclosed Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradingData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.ticker}</TableCell>
            <TableCell>{item.politican_name}</TableCell>
            <TableCell>{item.politician_party}</TableCell>
            <TableCell>{item.transaction_type}</TableCell>
            <TableCell>{item.disclosed_date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}