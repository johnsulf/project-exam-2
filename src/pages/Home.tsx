import ApiSmokeTest from "@/components/test/ApiSmokeTest";
import Tester from "@/components/test/Tester";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Tester />
      <ApiSmokeTest />
    </>
  );
}
