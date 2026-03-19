import { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";
import OptionButton from "./OptionButton";
import HistoryScreen from "./HistoryScreen";

interface Answers {
  checkin?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
  reflection?: string;
  feedback?: string;
}

interface HistoryEntry {
  date: string;
  answers: Answers;
  result: string[];
}

const TOTAL_SCREENS = 13;

const ExplorerFlow = () => {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const goTo = (target: number) => {
    setDirection(target > screen ? "forward" : "back");
    setTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setTransitioning(false);
    }, 250);
  };

  const next = () => goTo(screen + 1);
  const prev = () => goTo(Math.max(0, screen - 1));

  const generateResult = (): string[] => {
    const lines: string[] = [];

    const q1 = answers.q1;
    const q3 = answers.q3;
    const q5 = answers.q5;

    if (q1 === "Multiple genders" || q3 === "Multiple genders" || q5 === "Multiple genders") {
      lines.push("You may experience attraction toward different kinds of people.");
    } else if (q1 === "Different gender" && q3 === "Different gender" && q5 === "Different gender") {
      lines.push("You may mostly feel attracted to people of a different gender than your own.");
    } else if (q1 === "Same gender" || q3 === "Same gender" || q5 === "Same gender") {
      lines.push("You may feel a stronger sense of attraction toward people of the same gender.");
    } else if (q1 === "I rarely feel this" || answers.q2 === "Rarely") {
      lines.push("You may experience lower levels of physical attraction compared to others.");
    } else {
      lines.push("You may still be figuring out how you experience attraction.");
    }

    if (answers.q7 === "Yes") {
      lines.push("You're still exploring, and that's completely okay.");
    }
    if (answers.q8 === "Yes" || answers.q8 === "A little") {
      lines.push("Your feelings may change over time, and that's completely valid.");
    }
    if (answers.q4 === "Very important") {
      lines.push("You may value emotional connection as an important part of attraction.");
    }
    if (q1 === "It varies" || q3 === "It varies") {
      lines.push("Your experience of attraction may vary depending on the situation.");
    }

    return lines.length > 0 ? lines.slice(0, 3) : ["You may still be figuring out how you experience attraction."];
  };

  const saveToHistory = () => {
    const result = generateResult();
    const entry: HistoryEntry = {
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      answers,
      result,
    };
    const existing = JSON.parse(localStorage.getItem("spectrum-history") || "[]");
    existing.unshift(entry);
    localStorage.setItem("spectrum-history", JSON.stringify(existing));
  };

  if (showHistory) {
    return <HistoryScreen onBack={() => setShowHistory(false)} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 0:
        return (
          <ScreenWrapper>
            <h1 className="text-2xl font-semibold text-foreground mb-4">Sexuality Spectrum Explorer</h1>
            <p className="text-muted-foreground text-justified leading-relaxed">
              Explore your attraction, at your own pace.
            </p>
            <div className="mt-8">
              <PrimaryButton onClick={next}>Start</PrimaryButton>
            </div>
          </ScreenWrapper>
        );

      case 1:
        return (
          <ScreenWrapper>
            <h2 className="text-xl font-semibold text-foreground mb-4">About this activity</h2>
            <p className="text-muted-foreground text-justified leading-relaxed mb-4">
              This activity is here to help you explore your patterns of attraction—emotional, romantic, and physical.
            </p>
            <p className="text-muted-foreground text-justified leading-relaxed mb-4">
              There are no right or wrong answers, and you don't need to label yourself unless you want to. This is simply a space to reflect on what feels true for you right now.
            </p>
            <p className="text-muted-foreground text-justified leading-relaxed mb-6">
              You can skip any question or stop at any time.
            </p>
            <div className="bg-accent/60 rounded-2xl p-4 mb-8">
              <p className="text-sm text-muted-foreground text-justified italic">
                It's okay if your feelings are still evolving or unclear.
              </p>
            </div>
            <div className="flex gap-3">
              <SecondaryButton onClick={prev}>Go Back</SecondaryButton>
              <PrimaryButton onClick={next}>Continue</PrimaryButton>
            </div>
          </ScreenWrapper>
        );

      case 2:
        return (
          <QuestionScreen
            title="How are you feeling right now?"
            options={["Okay", "Unsure", "A bit overwhelmed"]}
            selected={answers.checkin}
            onSelect={(v) => setAnswer("checkin", v)}
            onNext={next}
            helperText={answers.checkin === "A bit overwhelmed" ? "Take your time. You can skip questions whenever you need." : undefined}
          />
        );

      case 3:
        return (
          <QuestionScreen
            title="Who do you feel physically attracted to?"
            category="Physical Attraction"
            categoryColor="pride-red"
            options={["Different gender", "Same gender", "Multiple genders", "I rarely feel this", "Not sure"]}
            selected={answers.q1}
            onSelect={(v) => setAnswer("q1", v)}
            onNext={next}
            showSkip
          />
        );

      case 4:
        return (
          <QuestionScreen
            title="How often do you experience physical attraction?"
            category="Physical Attraction"
            categoryColor="pride-red"
            options={["Often", "Sometimes", "Rarely", "Not sure"]}
            selected={answers.q2}
            onSelect={(v) => setAnswer("q2", v)}
            onNext={next}
            showSkip
          />
        );

      case 5:
        return (
          <QuestionScreen
            title="Who do you feel emotionally connected to?"
            category="Emotional Connection"
            categoryColor="pride-orange"
            options={["Different gender", "Same gender", "Multiple genders", "It varies", "Not sure"]}
            selected={answers.q3}
            onSelect={(v) => setAnswer("q3", v)}
            onNext={next}
            showSkip
          />
        );

      case 6:
        return (
          <QuestionScreen
            title="How important is emotional connection in attraction for you?"
            category="Emotional Connection"
            categoryColor="pride-orange"
            options={["Very important", "Somewhat important", "Not very important", "Not sure"]}
            selected={answers.q4}
            onSelect={(v) => setAnswer("q4", v)}
            onNext={next}
            showSkip
          />
        );

      case 7:
        return (
          <QuestionScreen
            title="Who do you imagine romantic relationships with?"
            category="Romantic Attraction"
            categoryColor="pride-yellow"
            options={["Different gender", "Same gender", "Multiple genders", "Not sure"]}
            selected={answers.q5}
            onSelect={(v) => setAnswer("q5", v)}
            onNext={next}
            showSkip
          />
        );

      case 8:
        return (
          <QuestionScreen
            title="How often do you develop romantic feelings?"
            category="Romantic Attraction"
            categoryColor="pride-yellow"
            options={["Often", "Sometimes", "Rarely", "Not sure"]}
            selected={answers.q6}
            onSelect={(v) => setAnswer("q6", v)}
            onNext={next}
            showSkip
          />
        );

      case 9:
        return (
          <QuestionScreen
            title="Are you still exploring your feelings?"
            category="Exploration"
            categoryColor="pride-green"
            options={["Yes", "No", "Not sure"]}
            selected={answers.q7}
            onSelect={(v) => setAnswer("q7", v)}
            onNext={next}
            showSkip
          />
        );

      case 10:
        return (
          <QuestionScreen
            title="Have your feelings about attraction changed over time?"
            category="Exploration"
            categoryColor="pride-green"
            options={["Yes", "A little", "No", "Not sure"]}
            selected={answers.q8}
            onSelect={(v) => setAnswer("q8", v)}
            onNext={next}
            showSkip
          />
        );

      case 11:
        return (
          <ScreenWrapper>
            <div className="mb-2">
              <span className="text-xs font-medium text-pride-blue uppercase tracking-wider">Optional Reflection</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-4 text-justified">
              What kind of connection feels most meaningful to you?
            </h2>
            <textarea
              value={answers.reflection || ""}
              onChange={(e) => setAnswer("reflection", e.target.value)}
              placeholder="Share your thoughts here... (optional)"
              className="w-full min-h-[120px] bg-card border border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-pride-blue/30 resize-none text-justified"
            />
            <div className="flex gap-3 mt-8">
              <SecondaryButton onClick={next}>Skip</SecondaryButton>
              <PrimaryButton onClick={next}>Continue</PrimaryButton>
            </div>
          </ScreenWrapper>
        );

      case 12: {
        const result = generateResult();
        return (
          <ScreenWrapper>
            <div className="w-full h-1 rounded-full mb-6 opacity-40" style={{
              background: "linear-gradient(90deg, hsl(var(--pride-red)), hsl(var(--pride-orange)), hsl(var(--pride-yellow)), hsl(var(--pride-green)), hsl(var(--pride-blue)), hsl(var(--pride-purple)))"
            }} />
            <h2 className="text-xl font-semibold text-foreground mb-6">Your Attraction Patterns</h2>
            <div className="space-y-3 mb-8">
              {result.map((line, i) => (
                <p key={i} className="text-muted-foreground text-justified leading-relaxed">{line}</p>
              ))}
            </div>

            {!feedbackGiven ? (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-3">Does this feel accurate?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedbackGiven(true)}
                    className="flex-1 py-3 rounded-2xl bg-pride-green/20 text-foreground font-medium transition-all hover:bg-pride-green/30"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => { setAnswer("feedback", "not really"); setFeedbackGiven(true); }}
                    className="flex-1 py-3 rounded-2xl bg-card text-foreground font-medium transition-all hover:bg-accent"
                  >
                    Not really
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                {answers.feedback === "not really" && (
                  <div className="bg-accent/60 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-muted-foreground text-justified italic">
                      Your experience may be more unique than patterns we can capture—and that's completely valid.
                    </p>
                  </div>
                )}
                <div className="flex gap-3">
                  <PrimaryButton onClick={() => { saveToHistory(); setScreen(0); setAnswers({}); setFeedbackGiven(false); }}>
                    Save & Done
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setShowHistory(true)}>
                    Past History
                  </SecondaryButton>
                </div>
              </div>
            )}

            <Footer />
          </ScreenWrapper>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Pride gradient background */}
      <div className="fixed inset-0 -z-10 opacity-[0.07]" style={{
        background: "linear-gradient(180deg, hsl(var(--pride-red)) 0%, hsl(var(--pride-orange)) 16%, hsl(var(--pride-yellow)) 33%, hsl(var(--pride-green)) 50%, hsl(var(--pride-blue)) 66%, hsl(var(--pride-purple)) 83%, hsl(var(--pride-red)) 100%)"
      }} />
      <div className="fixed inset-0 -z-10 bg-background/80" />

      <div className="w-full max-w-md mx-auto px-5 py-8 flex flex-col min-h-screen">
        {screen >= 2 && screen <= 11 && (
          <div className="mb-6">
            <ProgressBar current={screen - 1} total={10} />
          </div>
        )}
        <div
          className={`flex-1 flex flex-col justify-center transition-all duration-250 ease-out ${
            transitioning
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          {renderScreen()}
        </div>
        {screen < 12 && <Footer />}
      </div>
    </div>
  );
};

// Sub-components

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full">{children}</div>
);

interface QuestionScreenProps {
  title: string;
  category?: string;
  categoryColor?: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  showSkip?: boolean;
  helperText?: string;
  
}

const categoryColorMap: Record<string, string> = {
  "pride-red": "text-pride-red",
  "pride-orange": "text-pride-orange",
  "pride-yellow": "text-pride-yellow",
  "pride-green": "text-pride-green",
  "pride-blue": "text-pride-blue",
  "pride-purple": "text-pride-purple",
};

const QuestionScreen = ({ title, category, categoryColor, options, selected, onSelect, onNext, showSkip, helperText }: QuestionScreenProps) => (
  <ScreenWrapper>
    {category && (
      <div className="mb-2">
        <span className={`text-xs font-medium ${categoryColorMap[categoryColor || ""] || "text-muted-foreground"} uppercase tracking-wider`}>{category}</span>
      </div>
    )}
    <h2 className="text-lg font-semibold text-foreground mb-6 text-justified">{title}</h2>
    <div className="space-y-3 mb-6">
      {options.map((opt) => (
        <OptionButton key={opt} label={opt} selected={selected === opt} onClick={() => onSelect(opt)} />
      ))}
    </div>
    {helperText && (
      <div className="bg-accent/60 rounded-2xl p-4 mb-4">
        <p className="text-sm text-muted-foreground text-justified italic">{helperText}</p>
      </div>
    )}
    <div className="flex gap-3">
      {showSkip && <SecondaryButton onClick={onNext}>Skip</SecondaryButton>}
      <PrimaryButton onClick={onNext} disabled={!selected && !showSkip}>Next</PrimaryButton>
    </div>
  </ScreenWrapper>
);

const PrimaryButton = ({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const SecondaryButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="flex-1 py-3.5 rounded-2xl bg-card text-foreground font-medium border border-border transition-all duration-300 hover:bg-accent"
  >
    {children}
  </button>
);

const Footer = () => (
  <div className="py-4 mt-4">
    <p className="text-xs text-muted-foreground/60 text-center">
      🔐 Your responses are private and in your control.
    </p>
  </div>
);

export default ExplorerFlow;
