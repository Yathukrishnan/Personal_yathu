export default function PageHead({ label, title }) {
  return (
    <div className="page-head reveal">
      <span className="label mono">{label}</span>
      <h1 className="page-head__title">{title}</h1>
    </div>
  );
}
