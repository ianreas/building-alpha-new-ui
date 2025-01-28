import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Docs for an API</h1>
      <Link href={"https://rapidapi.com/muhammedik111101/api/fastfinanceapi/playground/apiendpoint_bbfdb4df-e235-47cb-b28a-ee38e31840ba"} target="_blank">
        <Button>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default AboutPage;
