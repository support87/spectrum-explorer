import { useEffect, useState } from "react";

interface HistoryEntry {
  date: string;
  result: string[];
}

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen = ({ onBack }: HistoryScreenProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("spectrum-history") || "[]");
    setHistory(data);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col min-h-screen">
        <h2 className="text-xl font-semibold text-foreground mb-6">Past Explorations</h2>

        {history.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-justified">No past explorations yet. Complete the activity to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {history.map((entry, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border">
                <p className="text-xs text-muted-foreground/60 mb-3">{entry.date}</p>
                <div className="space-y-2">
                  {entry.result.map((line, j) => (
                    <p key={j} className="text-sm text-muted-foreground text-justified leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium mt-6 transition-all hover:opacity-90"
        >
          Back to Explorer
        </button>

        <div className="py-4 mt-2">
          <p className="text-xs text-muted-foreground/60 text-center">
            🔐 Your responses are private and in your control.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
