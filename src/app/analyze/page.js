import SummaryBox from "@/components/app/SummaryBox";
import Uploadform from "@/components/app/Uploadform";
import React from "react";

const Analyze = () => {
  return (
    <div className="flex items-center justify-center gap-2 h-screen container mx-auto">
      <Uploadform />
      <SummaryBox />
    </div>
  );
};

export default Analyze;
