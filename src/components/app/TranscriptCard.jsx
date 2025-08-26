import React from "react";
import { Card } from "../ui/card";

const SummaryBox = ({}) => {
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Transcript Preview
        </CardTitle>
        <CardDescription className="text-gray-300">
          {isGenerated
            ? "Transcript generated successfully"
            : "Your transcript will appear here"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 max-h-96 overflow-y-auto">
        {!isGenerated ? (
          <div className="flex items-center justify-center h-32 text-gray-400 italic">
            No file uploaded yet
          </div>
        ) : (
          <>
            <p>{transcript.transcriptText}</p>
          </>
        )}

        {analyzedData && (
          <div className="mt-4 p-3 border border-gray-700 rounded-lg">
            <h2 className="font-semibold text-lg">Analysis</h2>

            {/* Show interviewee feedback */}
            <div className="mt-2">
              <h3 className="font-semibold">Interviewee Feedback</h3>
              <p>
                <strong>What went well:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analyzedData.analysesText.interviewee_feedback.what_went_well.map(
                  (point, i) => (
                    <li key={i}>{point}</li>
                  )
                )}
              </ul>

              <p className="mt-2">
                <strong>What could improve:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analyzedData.analysesText.interviewee_feedback.what_could_improve.map(
                  (point, i) => (
                    <li key={i}>{point}</li>
                  )
                )}
              </ul>
            </div>

            {/* Show recruiter feedback */}
            <div className="mt-4">
              <h3 className="font-semibold">Recruiter Feedback</h3>
              <p>
                <strong>Areas missed:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analyzedData.analysesText.recruiter_feedback.areas_missed.map(
                  (point, i) => (
                    <li key={i}>{point}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      {isGenerated && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={getAnalyzedData}
          >
            <BrainCog /> Generate Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SummaryBox;
