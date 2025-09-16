import ApiSmokeTest from "@/components/test/ApiSmokeTest";
import ComponentsTester from "@/components/test/ComponentsTester";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Kitchen() {
  // for crash testing
  const [crash, setCrash] = useState(false);
  if (crash) {
    throw new Error("Crash!");
  }
  return (
    <>
      <h1 className="text-2xl font-semibold">Kitchen Sink</h1>
      <div className="grid gap-4 md:grid-cols-2"></div>
      <ComponentsTester />
      <div className="flex gap-3 my-2">
        <ApiSmokeTest />
        <Button onClick={() => setCrash(true)}>Crash page</Button>
      </div>
    </>
  );
}
