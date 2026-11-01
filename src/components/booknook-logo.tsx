type BookNookLogoProps = {
  subtitle?: boolean;
};

export default function BookNookLogo({ subtitle = false }: BookNookLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        aria-hidden="true"
        className="size-10 shrink-0 max-[380px]:!size-8"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          className="brand-book-page"
          d="M23 15.2c-4.1-3.1-9.2-3.7-15-2.3v21.4c5.8-1.4 10.9-.8 15 2.3V15.2Z"
        />
        <path
          className="brand-book-page"
          d="M25 15.2c4.1-3.1 9.2-3.7 15-2.3v21.4c-5.8-1.4-10.9-.8-15 2.3V15.2Z"
        />
        <path className="brand-book-spine" d="M24 15v23" />
        <path className="brand-book-detail" d="M11 18.5c3.4-.5 6.2-.1 8.5 1.2M37 18.5c-3.4-.5-6.2-.1-8.5 1.2" />
      </svg>
      <span className="min-w-0">
        <span className="brand-wordmark font-sans text-[1.3rem] font-bold leading-5 tracking-tight max-[380px]:!text-lg">
          <span className="brand-wordmark-book">Book</span><span className="brand-wordmark-nook">Nook</span>
        </span>
        {subtitle && (
          <span className="brand-subtitle mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.2em] max-[380px]:hidden">
            The Reading Atelier
          </span>
        )}
      </span>
    </span>
  );
}
