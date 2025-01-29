import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-opacity-50 bg-[#BBDADD] shadow-sm backdrop-blur-sm border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold">BuildingAlpha</span>
          </div>
          <div className="flex">
            <Link href="/" passHref>
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/stocks-table" passHref>
              <Button variant="ghost">Stock Screener</Button>
            </Link>
            <Link href="/about" passHref>
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/my-api" passHref>
              <Button variant="ghost">API</Button>
            </Link>
            <Link href="/options-calculator" passHref>
              <Button variant="ghost">Options Calculator</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
