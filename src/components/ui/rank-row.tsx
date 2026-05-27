import type { CSSProperties } from "react";
import { discordColors } from "../../lib/discord-theme.js";
import { Avatar } from "./avatar.js";
import { ScoreBadge } from "./score-badge.js";

const POSITION_COLORS: Record<number, string> = {
  0: "#f0b232",
  1: "#b5bac1",
  2: "#cd7f32",
};

interface RankRowProps {
  position: number;
  username: string;
  score: number;
  avatarUrl: string;
  isLast: boolean;
}

export function RankRow({ position, username, score, avatarUrl, isLast }: RankRowProps) {
  const positionColor = POSITION_COLORS[position] ?? discordColors.textMuted;
  const isTopThree = position < 3;
  const rowStyle: CSSProperties = {
    padding: "12px 18px",
    marginBottom: isLast ? 0 : 8,
    backgroundColor: isTopThree ? discordColors.backgroundPrimary : "transparent",
    borderRadius: 10,
  };

  return (
    <div tw="flex items-center" style={rowStyle}>
      <span
        tw="text-base text-center"
        style={{ color: positionColor, fontWeight: 700, width: 40, flexShrink: 0 }}
      >
        {position + 1}
      </span>

      <div tw="flex" style={{ marginLeft: 12, marginRight: 16 }}>
        <Avatar src={avatarUrl} size={48} />
      </div>

      <span
        tw="text-lg"
        style={{
          color: isTopThree ? discordColors.textNormal : discordColors.textMuted,
          fontWeight: isTopThree ? 600 : 500,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {username}
      </span>

      <ScoreBadge value={score} />
    </div>
  );
}
