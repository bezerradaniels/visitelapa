type ItemComCategoria = {
  categoria: string;
};

export function criarFiltrosPorCategoria<T extends ItemComCategoria>(itens: T[]) {
  const categorias = Array.from(new Set(itens.map((item) => item.categoria)));

  return [
    { label: "Todos" },
    ...categorias.map((categoria) => ({ label: categoria })),
  ];
}
