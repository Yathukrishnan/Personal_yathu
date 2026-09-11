export default function ServiceCards({ items }) {
  return (
    <div className="cards">
      {items.map((item, i) => (
        <article className="card reveal" key={item.title} style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
          <div className="card__top">
            <span className="card__num mono">{item.num}</span>
            <span className="card__arrow" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="card__body">
            <h3 className="card__title">{item.title}</h3>
            <p className="card__text">{item.text}</p>
            <div className="card__tags">
              {item.tags.map((t) => (
                <span className="chip mono" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
