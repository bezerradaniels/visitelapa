import Image from "next/image";
import { ImageCropFocus, ImageFieldValue } from "@/tipos/plataforma";

type GaleriaPostProps = {
  imagens: ImageFieldValue;
};

const OBJECT_POSITIONS: Record<ImageCropFocus, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

export default function GaleriaPost({
  imagens,
}: GaleriaPostProps) {
  if (!imagens.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Galeria
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-main">
            Imagens do artigo
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {imagens.length} {imagens.length === 1 ? "imagem" : "imagens"}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {imagens.map((imagem, index) => (
          <figure
            key={imagem.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={imagem.src}
                alt={imagem.name || `Imagem ${index + 1} do artigo`}
                fill
                unoptimized
                className="object-cover transition duration-300"
                style={{
                  objectPosition: OBJECT_POSITIONS[imagem.cropFocus],
                  transform: `scale(${imagem.zoom})`,
                }}
              />
            </div>

            <figcaption className="px-4 py-3 text-sm text-slate-600">
              {imagem.name || `Imagem ${index + 1}`}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
