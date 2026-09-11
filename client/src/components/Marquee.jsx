export default function Marquee({ items }) {
  const group = items.map((item) => (
    <span className="marquee__item mono" key={item}>
      {item}
      <span className="marquee__star">✦</span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__group">{group}</div>
        <div className="marquee__group">{group}</div>
      </div>
    </div>
  );
}
