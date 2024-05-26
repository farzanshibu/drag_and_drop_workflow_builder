import AnimatedContainer from "@/components/global/animated-container";
import Navbar from "@/components/global/navbar";
import ReactFlowHomeContainer from "@/components/global/reactflow-home-container";
import { Spotlight } from "@/components/global/spotlight";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="h-screen w-full flex pt-11 items-start md:items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden shadow-md">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <ReactFlowHomeContainer />
        <div className="absolute left-0 bottom-0 md:relative">
          <AnimatedContainer />
        </div>
      </div>
    </>
  );
}
