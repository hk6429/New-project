export function AcademyCrest({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? "academy-crest is-compact" : "academy-crest"} viewBox="0 0 160 180" role="img" aria-label="借代偵探學院院徽">
      <path className="crest-shield" d="M80 8 146 31v55c0 43-25 70-66 86C39 156 14 129 14 86V31Z" />
      <path className="crest-page" d="M43 54c15-7 27-5 37 3 10-8 22-10 37-3v62c-15-5-27-3-37 6-10-9-22-11-37-6Z" />
      <path className="crest-spine" d="M80 57v65" />
      <circle className="crest-lens" cx="103" cy="76" r="20" />
      <path className="crest-handle" d="m118 91 18 18" />
      <text x="61" y="100" aria-hidden="true">代</text>
      {!compact && <path className="crest-ribbon" d="M37 139h86M49 151h62" />}
    </svg>
  );
}
