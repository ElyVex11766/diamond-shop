export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-diamond-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}