import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { executeCode } from "@/lib/actions/file.actions";
import { cn } from "@/lib/utils";

const Output = ({ code, language }: OutputProps) => {
  // states to store the output, loading state, and error state
  const [output, setOutput] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // function to run the code
  const runCode = async () => {
    if (!code) return;
    try {
      setIsLoading(true);
      const result = await executeCode({ language: language, sourceCode: code });

      if (!result) {
        throw new Error("Failed to execute code");
      }

      setOutput(result.run.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
      // add toast message
      console.log("Code executed successfully");
    } catch (error: any) {
      console.error(error);
      // add toast message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={"w-2/5 flex flex-col justify-between gap-y-3"}>
      <div className={"flex justify-between"}>
        <h2 className={"font-semibold text-xl pt-2"}>Output: </h2>
        <Button variant={"destructive"} onClick={runCode}>
          Run Code
        </Button>
      </div>
      <div
        className={cn("h-[75vh] p-3 shadow-md rounded-md break-words bg-white overflow-auto", {
          "bg-red-100": isError,
        })}
      >
        {output ? output.map((line, i) => <p key={i}>{line}</p>) : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;