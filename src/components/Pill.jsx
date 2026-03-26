import { S } from "../styles";

export default function Pill({ active, color, darkText, onClick, children, small }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "3px 8px" : "4px 12px",
      borderRadius: small ? 14 : 18,
      border: "none", cursor: "pointer",
      background: active ? (color || S.accent) : S.surface2,
      color: active ? (darkText ? "#000" : "#fff") : S.textMuted,
      fontWeight: 700, fontSize: small ? 10 : 11,
      transition: "all .15s", whiteSpace: "nowrap",
      fontFamily: S.body,
    }}>{children}</button>
  );
}
