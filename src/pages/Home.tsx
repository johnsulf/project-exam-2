import ApiSmokeTest from "@/components/test/ApiSmokeTest";
import ComponentsTester from "@/components/test/ComponentsTester";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <ComponentsTester />
      <ApiSmokeTest />
    </>
  );
}
