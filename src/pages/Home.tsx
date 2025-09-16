import ApiSmokeTest from "@/components/test/ApiSmokeTest";
import ComponentsTester from "@/components/test/ComponentsTester";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  // for crash testing
  const [crash, setCrash] = useState(false);
  if (crash) {
    throw new Error("Crash!");
  }
  return (
    <>
      <h1>Home</h1>
      <ComponentsTester />
      <div className="flex gap-3 my-2">
        <ApiSmokeTest />
        <Button onClick={() => setCrash(true)}>Crash page</Button>
      </div>
    </>
  );
}
