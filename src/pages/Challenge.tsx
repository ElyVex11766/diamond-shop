import { SectionTitle } from "../components/SectionTitle";
import { ReactionTest } from "../components/ReactionTest";

export function Challenge() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <SectionTitle 
        title="چالش Diamond" 
        subtitle="سرعتت رو محک بزن و جزو ۳ نفر برتر هفته باش!" 
      />
      
      <div className="rounded-3xl border border-diamond-cyan/30 bg-gradient-to-b from-diamond-panel to-diamond-bg p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-diamond-cyan/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <ReactionTest />
      </div>
    </div>
  );
}
