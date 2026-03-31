import T from '../../theme/tokens';

export default function ScoreBar({ score, height = 6 }) {
  const color = score >= 80 ? T.green : score >= 60 ? T.yellow : score >= 40 ? T.orange : T.red;
  return (
    <div style={{ flex: 1, height, background: T.gray100, borderRadius: height, overflow: "hidden" }}>
      <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: height, transition: "width 0.8s ease" }} />
    </div>
  );
}
