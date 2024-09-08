import FinancialDashboard from "@/app/components/FinancialDashboard";

export default function HomePage() {
  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Financial Market Overview</h1>
        <FinancialDashboard />
      </div>
    </>
  );
}
