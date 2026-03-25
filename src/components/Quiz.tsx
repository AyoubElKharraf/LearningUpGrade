import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

export const Quiz = ({ questions, onComplete }: QuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[currentIndex];
  const isCorrect = selectedAnswer === current?.correctAnswer;

  if (!questions.length || !current) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-card text-sm text-muted-foreground">
        Loading quiz...
      </div>
    );
  }

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      onComplete(score + (isCorrect ? 0 : 0), questions.length);
    }
  };

  if (completed) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-8 text-center shadow-card">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${percentage >= 70 ? 'bg-success/10' : 'bg-warning/10'}`}>
          <span className={`font-display text-3xl font-bold ${percentage >= 70 ? 'text-success' : 'text-warning'}`}>
            {percentage}%
          </span>
        </div>
        <h3 className="font-display text-xl font-bold">
          {percentage >= 70 ? "Great job! 🎉" : "Keep practicing! 💪"}
        </h3>
        <p className="text-muted-foreground">
          You scored {finalScore} out of {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < currentIndex ? "bg-success" : i === currentIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="mb-5 font-display text-lg font-semibold">{current.question}</h3>

      <div className="flex flex-col gap-2.5">
        {current.options.map((option, i) => {
          let optionStyle = "border-border hover:border-primary/40 hover:bg-primary/5";
          if (showResult) {
            if (i === current.correctAnswer) optionStyle = "border-success bg-success/5";
            else if (i === selectedAnswer) optionStyle = "border-destructive bg-destructive/5";
            else optionStyle = "border-border opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`flex items-center gap-3 rounded-lg border-2 p-3.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${optionStyle}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && i === current.correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
              {showResult && i === selectedAnswer && i !== current.correctAnswer && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-4 rounded-lg p-3 text-sm ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
          {current.explanation}
        </div>
      )}

      {showResult && (
        <Button onClick={handleNext} className="mt-4 w-full" variant="default">
          {currentIndex < questions.length - 1 ? (
            <>Next Question <ArrowRight className="h-4 w-4" /></>
          ) : (
            "See Results"
          )}
        </Button>
      )}
    </div>
  );
};
