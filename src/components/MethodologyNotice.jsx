import { S } from "../styles";

export default function MethodologyNotice({ type = "app", children }) {
  const styles = {
    app: { borderColor: S.accent, icon: "\u26a0" },
    divergence: { borderColor: "#e74c3c", icon: "\u26a0" },
    info: { borderColor: "#3498db", icon: "\u2139\ufe0f" },
  };
  const cfg = styles[type] || styles.app;

  return (
    <div
      role="note"
      style={{
        marginTop: 14,
        background: S.surface,
        borderRadius: 10,
        padding: "12px 16px",
        borderLeft: `3px solid ${cfg.borderColor}`,
        fontSize: 11,
        color: S.textMuted,
        lineHeight: 1.6,
      }}
    >
      {children || (
        <>
          <strong style={{ color: S.textSecondary }}>
            {cfg.icon} Nota metodol&oacute;gica:
          </strong>{" "}
          a &aacute;rea por jogador (ApP = m&sup2; / n&ordm; de jogadores de
          campo) &eacute; calculada com base nos jogadores de linha, excluindo
          goleiros e coringas, pois estes ocupam espa&ccedil;os funcionalmente
          distintos. O total de participantes deve ser considerado separadamente
          para dimensionamento log&iacute;stico do campo.
        </>
      )}
    </div>
  );
}
