import { ModeToggle } from "@/components/shared/ModeToggle/ModeToggle";

export default function Home() {
  return (
    <div className="bg-background h-screen w-screen">
      <h1>Hello FeedLoop</h1>
      <ModeToggle />
    </div>
  );
}
