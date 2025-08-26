import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <h1 className="text-5xl md:text-4xl font-bold bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-lg">
        FeedLoop
      </h1>

      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        AI-powered media analysis tool that converts your audio/video into clean
        transcripts, summaries, and insights. Upload. Analyze. Learn.
      </p>
    </div>
  );
};

export default Header;
