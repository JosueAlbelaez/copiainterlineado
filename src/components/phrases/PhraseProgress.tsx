interface PhraseProgressProps {
  current: number;
  total: number;
  showTotal?: boolean;
}

export function PhraseProgress({ current, total, showTotal = true }: PhraseProgressProps) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showTotal && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {current} de {total} frases
        </p>
      )}
    </div>
  );
}