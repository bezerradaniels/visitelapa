type TituloSecaoProps = {
  titulo: string;
  subtitulo?: string;
};

export default function TituloSecao({
  titulo,
  subtitulo,
}: TituloSecaoProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-main">{titulo}</h2>

      {subtitulo && (
        <p className="mt-2 text-gray-600">{subtitulo}</p>
      )}
    </div>
  );
}