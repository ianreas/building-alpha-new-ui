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

type RedditDataItem = {
  mentions: number;
  mentions_24h_ago: number;
  name: string;
  rank: number;
  rank_24h_ago: number;
  ticker: string;
  upvotes: number;
};

export default function RedditData() {
  const [redditData, setRedditData] = useState<RedditDataItem[]>([]);

  useEffect(() => {
    const fetchRedditData = async () => {
      const response = await fetch(
        "https://buildingalpha-backend-74a6217c48ee.herokuapp.com/wsbMentions"
      );
      const data = await response.json();
      setRedditData(data.results.sort((a: RedditDataItem, b: RedditDataItem) => a.rank - b.rank).slice(0, 10));
    };
    fetchRedditData();
  }, []);

  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Mentions</TableHead>
            <TableHead>Mentions 24h Ago</TableHead>
            <TableHead>Rank 24h Ago</TableHead>
            <TableHead>Upvotes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {redditData.map((item) => (
            <TableRow key={item.ticker}>
              <TableCell>{item.rank}</TableCell>
              <TableCell>{item.ticker}</TableCell>
              <TableCell>{item.name.replace("amp;", "")}</TableCell>
              <TableCell>{item.mentions}</TableCell>
              <TableCell>{item.mentions_24h_ago}</TableCell>
              <TableCell>{item.rank_24h_ago}</TableCell>
              <TableCell>{item.upvotes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}