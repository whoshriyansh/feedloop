import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { BrainCog } from "lucide-react";

const AnalysisCard = ({ isGenerated, analyzedData, getAnalyzedData }) => {
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>Analysis </CardTitle>
        <CardDescription>
          Your Interviewee Feedback will appear here
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 overflow-y-auto">
        {analyzedData && (
          <div className="mt-4">
            {/* Show interviewee feedback */}
            <div className="mt-2">
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

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={getAnalyzedData}>
          <BrainCog /> Generate Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisCard;
