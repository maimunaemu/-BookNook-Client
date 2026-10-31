import Image from "next/image";

export default function BookCover({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#ebe9df] ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={`Cover of ${title}`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          unoptimized
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center bg-[#e6e9df] p-5 text-center">
          <span className="serif text-3xl text-[#46624f]">B</span>
          <span className="mt-2 text-[0.6rem] uppercase tracking-[0.13em] text-[#6d786c]">Cover coming soon</span>
        </div>
      )}
    </div>
  );
}
