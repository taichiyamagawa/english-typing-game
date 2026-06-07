// 英語女性音声で読み上げる共通ユーティリティ

/**
 * 指定したテキストを英語女性音声で読み上げる
 * @param text    読み上げる英文
 * @param onEnd   読み上げ完了時のコールバック（任意）
 */
export const speak = (text: string, onEnd?: () => void): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // 読み上げ中の音声があれば先にキャンセルする
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang   = "en-US";
  utterance.rate   = 0.85;  // 学習向けに少しゆっくり
  utterance.pitch  = 1.1;   // 女性寄りの音程に近づける
  utterance.volume = 0.5;   // ボリューム（0〜1）

  if (onEnd) utterance.onend = onEnd;

  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();

    // 女性英語音声を優先順位で選ぶ（ブラウザ・OSごとに名前が異なるため複数候補を用意）
    const voice =
      voices.find((v) => v.name === "Samantha") ||               // macOS / iOS（クリアな女性声）
      voices.find((v) => v.name === "Karen") ||                   // macOS オーストラリア英語
      voices.find((v) => v.name.includes("Google US English")) || // Chrome の女性英語音声
      voices.find((v) => v.name.includes("Zira")) ||              // Windows 女性音声
      voices.find((v) => v.lang === "en-US") ||                   // その他の US English
      null;

    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  // ボイス一覧がすでに読み込まれていれば即実行、なければ読み込み完了を待つ
  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", trySpeak, { once: true });
  }
};

// 読み上げを停止する
export const stopSpeaking = (): void => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
