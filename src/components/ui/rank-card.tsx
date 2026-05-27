import type { RankEntry } from "../../types/rank.js";
import { Card, CardHeader } from "./card.js";
import { RankRow } from "./rank-row.js";

export const RANK_CARD_WIDTH = 1280;
export const RANK_CARD_HEIGHT = 720;

interface RankCardProps {
  entries: RankEntry[];
}

export function RankCard({ entries }: RankCardProps) {
  const userCount = entries.length;
  const subtitle = `${userCount} usuário${userCount !== 1 ? "s" : ""}`;

  return (
    <Card width={RANK_CARD_WIDTH} height={RANK_CARD_HEIGHT}>
      <CardHeader title="Ranking de Score" subtitle={subtitle} />
      <div tw="flex flex-col">
        {entries.map((entry, index) => (
          <RankRow
            key={entry.userId}
            position={index}
            username={entry.username}
            score={entry.score}
            avatarUrl={entry.avatarUrl}
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}
