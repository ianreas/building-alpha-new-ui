import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold">BuildingAlpha</span>
          </div>
          <div className="flex">
            <Link href="/" passHref>
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/about" passHref>
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/my-api" passHref>
              <Button variant="ghost">API</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}