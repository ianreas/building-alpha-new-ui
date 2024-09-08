import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">What is this even?</h1>

      <div className="mb-8">
        <img
          src="/api/placeholder/300/200"
          alt="Profile"
          className="float-right ml-4 mb-4 rounded-lg shadow-md"
        />
        <p className="text-lg mb-4">
          Welcome! This is a website that I made to help me with my trading.
          I&apos;m not a financial advisor, this is just a toy project that I
          made to help me with my trading.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Why did I build this?</AccordionTrigger>
          <AccordionContent>
            It all started in 2021 when I started trading stock options. I am a
            data driven guy, so naturally, I needed some data to build my models
            and test them. I didnt really have money to buy expensive financial
            data. I contacted a few providers but they quotes me hundreds or
            even thousands of dollars per month. So I had to find alpha in the
            data that is publicly available on the internet and whatever I can
            derive from that data. I built data processing pipelines using AWS
            Batch that scrape, process, and upload that data to AWS RDS every
            day at 6am before the american markets open. I use this data heavily
            in a few of my options trading strategies.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Potential Trading Strategies</AccordionTrigger>
          <AccordionContent>
            I use this data heavily to trade a few of my favorite strategies:
            <ul className="list-disc pl-5">
              <li>
                Trading crazy high IV caused by retail trading activity. Look at
                the table of reddit mentions for different stocks. These trade
                at a crazy high IV (well above RV). *We all know about the Gamma
                Squeeze* This is a very good opportunity to sell straddles.
                Don&apos;t forget to hedge the delta of the straddle to maintain
                a neutral position! You can look at my IV Surface Graph to
                analyze the IV of the option.
              </li>
              <li>
                IV surface Graph (aka Volatility Smile) allows you to analyze
                the Skew and the Term Structure, trade the violations of
                call/put parity, and other IV related stuff.
              </li>
              <li>
                My Options Matrix is basically a calculator that tells you how
                much the option is going to cost in the future, if the
                underlying stock price costs X dollars on date Y. Use this to assess the risk of your 
                option trading strategies. 
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How Did I Build This?</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 mt-2">
              <li>
               Every day at 6 am my scrapers scrape a *ton* of data from many different sources using containerized Python scripts and AWS Batch. 
               They process it, derive more data from it (for example I implemented the Binomial Options Pricing Model to calculate the Option Prices), and upload
               it to my AWS RDS database. 
              </li>
              <li>I used Three.JS for the 3D IV Surface Graph. I am using tri-linear interpolation to make it look better.
                I am planning to switch it to WebGPU and WebAssembly though. (Learning lower level languages)</li>
              <li>
                Coming soon: RAG...
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutPage;
