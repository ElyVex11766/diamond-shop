interface Props {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionTitle({ title, subtitle, center = true }: Props) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <div className={`inline-flex items-center gap-3 ${center ? "" : ""}`}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/40" />
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {title}
        </h2>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/40" />
      </div>
      {subtitle && (
        <p className={`mt-3 text-gray-400 text-base ${center ? "max-w-2xl mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
