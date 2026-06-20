import { Article } from "@/types/article";

export const chessMoreThanAtomsArticle: Article = {
  id: "article_015",
  slug: "chess-more-than-atoms",
  title: "There Are More Chess Games Than Atoms in the Universe",
  titleJa: "チェスの局面数は宇宙の原子数より多い",
  description: "The number of possible chess games is so astronomically large that it dwarfs the number of atoms in the observable universe. What does this tell us about complexity, computers, and the human mind?",
  descriptionJa: "チェスで起こりうる局面の数は、観測可能な宇宙の原子数をはるかに超える規模だ。これは複雑さ、コンピューター、そして人間の知性について何を教えてくれるのか？",
  date: "2026-06-20",
  category: "science",
  categoryJa: "科学",
  emoji: "♟️",
  sections: [
    {
      type: "paragraph",
      en: "Sit down at a chessboard. You have 20 possible moves on your first turn. Your opponent has 20 possible responses. By the time each side has made just three moves, there are already over nine million possible positions on the board. By the end of a typical game, the number of possible sequences of moves is so large that it exceeds the number of atoms in the observable universe.",
      ja: "チェスの盤の前に座ったとしよう。最初の手には20通りの選択肢がある。相手にも20通りの応手がある。両者が3手ずつ指した時点で、盤上に生じうる局面はすでに900万通りを超える。そして1ゲームが終わる頃には、指し手の連続の数が観測可能な宇宙の原子の数を超えてしまう。",
    },
    {
      type: "heading",
      en: "The Shannon Number",
      ja: "シャノン数",
    },
    {
      type: "paragraph",
      en: "In 1950, mathematician Claude Shannon set out to estimate the total number of possible chess games. His calculation — now known as the Shannon Number — arrived at approximately 10 to the power of 120. Written out, that is a 1 followed by 120 zeros. To put that into perspective, the estimated number of atoms in the observable universe is around 10 to the power of 80. The Shannon Number is not just bigger — it is incomprehensibly bigger, by a factor of 10 to the power of 40.",
      ja: "1950年、数学者クロード・シャノンはチェスで起こりうる局面の総数を推定しようとした。彼の計算——現在「シャノン数」として知られる——は、約10の120乗という数値に達した。書き表すと、1の後ろにゼロが120個続く数字だ。比較のために言えば、観測可能な宇宙の原子数は約10の80乗とされる。シャノン数はただ大きいだけでなく、理解を超えた規模で大きく——その差は10の40乗倍にもなる。",
    },
    {
      type: "heading",
      en: "What That Number Actually Means",
      ja: "その数字が実際に意味すること",
    },
    {
      type: "paragraph",
      en: "Numbers of this magnitude are almost impossible to grasp intuitively, so comparisons help. If every atom in the universe were itself a universe, the total number of atoms across all those universes combined would still be vastly smaller than the number of possible chess games. Even if every person on Earth had been playing chess since the Big Bang — making one move per second — the total number of games completed would barely scratch the surface.",
      ja: "この規模の数は直感的に把握するのがほぼ不可能なので、比較が助けになる。宇宙のすべての原子がそれぞれ一つの宇宙だとして、そのすべての宇宙の原子の合計でさえ、チェスで起こりうる局面数よりはるかに少ない。地球上の全員がビッグバンからチェスを指し続け、1秒に1手のペースで進めたとしても、完了したゲームの総数はほとんど表面をかすりもしないだろう。",
    },
    {
      type: "heading",
      en: "Why Chess Cannot Be Solved by Brute Force",
      ja: "なぜチェスは力技では解けないのか",
    },
    {
      type: "paragraph",
      en: "This staggering complexity is why no computer has ever fully solved chess — meaning no machine has determined the perfect sequence of moves from start to finish. The game tree is simply too large to search exhaustively, even with the fastest hardware available. Unlike simpler games such as draughts, which was solved in 2007, chess remains an open problem in mathematics and computer science.",
      ja: "この圧倒的な複雑さゆえに、チェスを完全に「解いた」コンピューターはいまだ存在しない——つまり、スタートからゴールまでの完全な最善手順を求めたマシンはない。ゲームツリーは、現在最速のハードウェアをもってしても網羅的に探索するには大きすぎるのだ。2007年に解かれたチェッカーのような単純なゲームとは異なり、チェスは数学とコンピューター科学における未解決問題のままだ。",
    },
    {
      type: "paragraph",
      en: "What computers can do is play chess at a superhuman level. Programs like Stockfish and AlphaZero evaluate millions of positions per second and consistently beat the world's best human players. But evaluating positions is fundamentally different from solving the game. The difference is the difference between being very good at navigating a maze and having a complete map of every possible path through it.",
      ja: "コンピューターができることは、人間を超えるレベルでチェスを指すことだ。StockfishやAlphaZeroのようなプログラムは1秒間に何百万もの局面を評価し、世界最高の人間のプレイヤーに一貫して勝利する。しかし局面を評価することと、ゲームを解くことは本質的に異なる。その違いは、迷路をうまく進むことと、すべての可能な経路を示す完全な地図を持つことの違いだ。",
    },
    {
      type: "heading",
      en: "A Mirror for the Mind",
      ja: "知性を映す鏡",
    },
    {
      type: "paragraph",
      en: "For centuries, chess was regarded as a reliable measure of human intelligence. Modern research has complicated this view. Chess skill is more strongly linked to deliberate practice and pattern recognition than to raw intelligence. Top players do not calculate every possible move — they recognise familiar patterns from experience and focus their calculation on the most promising lines.",
      ja: "何世紀もの間、チェスは人間の知性を測る信頼できる尺度とみなされてきた。現代の研究はこの見方を複雑にした。チェスの強さは、素の知能よりも、意図的な練習とパターン認識に強く結びついている。トッププレイヤーは考えられるすべての手を計算しているのではなく、経験から慣れ親しんだパターンを認識し、最も有望な変化にだけ計算を集中させているのだ。",
    },
    {
      type: "paragraph",
      en: "What chess truly reflects is the extraordinary capacity of the human mind to make sense of near-infinite complexity — to find structure, meaning, and beauty in a space so vast that no machine has yet fully mapped it. The game has outlasted empires, fascinated scientists, and humbled computers. The board is small. The possibilities are not.",
      ja: "チェスが本当に映し出しているのは、ほぼ無限の複雑さに意味を見出す人間の知性の驚くべき能力だ——いまだどのマシンも完全には地図を描けないほど広大な空間の中に、構造と意味と美しさを見つける能力。このゲームは帝国よりも長く続き、科学者を魅了し、コンピューターを打ち負かした。盤は小さい。しかし可能性はそうではない。",
    },
  ],
};
