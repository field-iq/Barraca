export interface StandardFurnitureItem {
  id: string;
  name: string;
  description: string;
  detailTitle: string;
  detailDescription: string;
  dimensions: string;
  listPrice: number;
  cashPrice: number;
  images: string[];
  imageAlt: string;
  imageFit?: "cover" | "contain";
}

export const STANDARD_FURNITURE: StandardFurnitureItem[] = [
  {
    id: "mesa-comedor-200",
    name: "Mesa comedor",
    description: "Mesa de madera maciza con medida estándar.",
    detailTitle: "Mesa comedor 2.00 x 1.00 mts",
    detailDescription:
      "Una mesa de comedor firme, cálida y de escala muy cómoda para el uso diario. Esta medida funciona muy bien en comedores familiares y espacios integrados, con presencia de madera maciza y una terminación pensada para acompañar muchos años de reuniones.",
    dimensions: "2.00 x 1.00 mts",
    listPrice: 1_140_000,
    cashPrice: 950_000,
    images: ["/catalogo/mesa-comedor-200/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 2.00 x 1.00 mts",
  },
  {
    id: "mesa-comedor-240",
    name: "Mesa comedor",
    description: "Mesa amplia de madera maciza para comedor.",
    detailTitle: "Mesa comedor 2.40 x 1.20 mts",
    detailDescription:
      "Una mesa protagonista para comedores amplios. Sus proporciones permiten sentarse con comodidad y lucen especialmente bien en espacios donde la madera puede tomar protagonismo. Ideal para casas que viven alrededor de la mesa.",
    dimensions: "2.40 x 1.20 mts",
    listPrice: 1_620_000,
    cashPrice: 1_350_000,
    images: ["/catalogo/mesa-comedor-240/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 2.40 x 1.20 mts",
  },
  {
    id: "mesa-comedor-160",
    name: "Mesa comedor",
    description: "Mesa compacta de madera maciza para espacios chicos.",
    detailTitle: "Mesa comedor 1.60 x 0.80 mts",
    detailDescription:
      "Una opción compacta y práctica para departamentos, cocinas comedor o ambientes más chicos. Mantiene la presencia de una mesa de madera maciza, pero con una medida fácil de ubicar y de usar todos los días.",
    dimensions: "1.60 x 0.80 mts",
    listPrice: 828_000,
    cashPrice: 690_000,
    images: ["/catalogo/mesa-comedor-160/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 1.60 x 0.80 mts",
  },
  {
    id: "camastro-160",
    name: "Camastro",
    description: "Camastro de madera con profundidad estándar.",
    detailTitle: "Camastro 1.60 x 0.60 mts",
    detailDescription:
      "Un camastro robusto para armar un rincón de descanso en galería, living o espacio semicubierto. La madera aporta peso visual y calidez, y la profundidad permite usarlo como asiento amplio o pieza de apoyo.",
    dimensions: "1.60 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-180",
    name: "Camastro",
    description: "Camastro de madera con profundidad estándar.",
    detailTitle: "Camastro 1.80 x 0.60 mts",
    detailDescription:
      "Una medida versátil para quienes quieren un camastro con más presencia sin ocupar demasiado. Funciona bien con almohadones y textiles, y suma una base noble para espacios de descanso.",
    dimensions: "1.80 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-200",
    name: "Camastro",
    description: "Camastro de madera con profundidad estándar.",
    detailTitle: "Camastro 2.00 x 0.60 mts",
    detailDescription:
      "El camastro más largo de la línea estándar. Es ideal para galerías o livings amplios donde se busca una pieza de madera importante, cómoda y con mucha presencia.",
    dimensions: "2.00 x 0.60 mts prof.",
    listPrice: 1_020_000,
    cashPrice: 850_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro grande de madera maciza",
  },
  {
    id: "mesa-ratona-celosias-120",
    name: "Mesa ratona con laterales de celosías",
    description: "Mesa ratona con laterales trabajados.",
    detailTitle: "Mesa ratona con laterales de celosías",
    detailDescription:
      "Una mesa baja con más detalle artesanal. Los laterales de celosías suman textura y hacen que la pieza se destaque en el living, sin perder funcionalidad para el uso cotidiano.",
    dimensions: "1.20 x 0.70 x 0.45 mts alto",
    listPrice: 474_000,
    cashPrice: 395_000,
    images: [
      "/catalogo/mesa-ratona-celosias-120/1.jpeg",
      "/catalogo/mesa-ratona-celosias-120/2.jpeg",
      "/catalogo/mesa-ratona-celosias-120/3.jpeg",
    ],
    imageAlt: "Mesa ratona con laterales de celosías",
  },
  {
    id: "mesa-ratona-simple-120",
    name: "Mesa ratona simple",
    description: "Mesa ratona simple de madera maciza.",
    detailTitle: "Mesa ratona simple 1.20 x 0.70 mts",
    detailDescription:
      "Una mesa ratona limpia, funcional y fácil de combinar. Su formato simple deja que la madera sea protagonista y la vuelve una pieza muy adaptable para livings de distintos estilos.",
    dimensions: "1.20 x 0.70 x 0.40 mts alto",
    listPrice: 468_000,
    cashPrice: 390_000,
    images: [
      "/catalogo/mesa-ratona-simple/1.jpeg",
      "/catalogo/mesa-ratona-simple/2.jpeg",
    ],
    imageAlt: "Mesa ratona simple de madera maciza",
  },
  {
    id: "mesa-ratona-simple-100",
    name: "Mesa ratona",
    description: "Mesa ratona chica de madera maciza.",
    detailTitle: "Mesa ratona 1.00 x 0.50 mts",
    detailDescription:
      "Una versión más chica, práctica y liviana visualmente. Ideal para espacios reducidos o para acompañar un sillón sin cargar el ambiente.",
    dimensions: "1.00 x 0.50 x 0.40 mts alto",
    listPrice: 384_000,
    cashPrice: 320_000,
    images: [
      "/catalogo/mesa-ratona-simple/1.jpeg",
      "/catalogo/mesa-ratona-simple/2.jpeg",
    ],
    imageAlt: "Mesa ratona chica de madera maciza",
  },
  {
    id: "cilindros",
    name: "Cilindros",
    description: "Cilindros de madera maciza con diámetro fijo.",
    detailTitle: "Cilindros de madera maciza",
    detailDescription:
      "Piezas auxiliares versátiles para usar como apoyo, mesa lateral o detalle decorativo. Al venir en distintas alturas, pueden funcionar solas o combinadas para sumar volumen y textura al ambiente.",
    dimensions: "50, 60 y 70 cm alto - diámetro 30 cm",
    listPrice: 168_000,
    cashPrice: 140_000,
    images: ["/catalogo/cilindros/1.jpeg", "/catalogo/cilindros/2.jpeg"],
    imageAlt: "Cilindros de madera maciza",
  },
];

export function getStandardFurnitureItem(
  id: string,
): StandardFurnitureItem | undefined {
  return STANDARD_FURNITURE.find((item) => item.id === id);
}
