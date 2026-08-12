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
    description: "Mesa de madera maciza con medida estandar.",
    detailTitle: "Mesa comedor 2.00 x 1.00 mts",
    detailDescription:
      "Una mesa de comedor firme, calida y de escala muy comoda para el uso diario. Esta medida funciona muy bien en comedores familiares y espacios integrados, con presencia de madera maciza y una terminacion pensada para acompanar muchos anos de reuniones.",
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
      "Una opcion compacta y practica para departamentos, cocinas comedor o ambientes mas chicos. Mantiene la presencia de una mesa de madera maciza, pero con una medida facil de ubicar y de usar todos los dias.",
    dimensions: "1.60 x 0.80 mts",
    listPrice: 828_000,
    cashPrice: 690_000,
    images: ["/catalogo/mesa-comedor-160/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 1.60 x 0.80 mts",
  },
  {
    id: "camastro-160",
    name: "Camastro",
    description: "Camastro de madera con profundidad estandar.",
    detailTitle: "Camastro 1.60 x 0.60 mts",
    detailDescription:
      "Un camastro robusto para armar un rincon de descanso en galeria, living o espacio semicubierto. La madera aporta peso visual y calidez, y la profundidad permite usarlo como asiento amplio o pieza de apoyo.",
    dimensions: "1.60 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-180",
    name: "Camastro",
    description: "Camastro de madera con profundidad estandar.",
    detailTitle: "Camastro 1.80 x 0.60 mts",
    detailDescription:
      "Una medida versatil para quienes quieren un camastro con mas presencia sin ocupar demasiado. Funciona bien con almohadones y textiles, y suma una base noble para espacios de descanso.",
    dimensions: "1.80 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-200",
    name: "Camastro",
    description: "Camastro de madera con profundidad estandar.",
    detailTitle: "Camastro 2.00 x 0.60 mts",
    detailDescription:
      "El camastro mas largo de la linea estandar. Es ideal para galerias o livings amplios donde se busca una pieza de madera importante, comoda y con mucha presencia.",
    dimensions: "2.00 x 0.60 mts prof.",
    listPrice: 1_020_000,
    cashPrice: 850_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro grande de madera maciza",
  },
  {
    id: "mesa-ratona-celosias-120",
    name: "Mesa ratona con laterales de celosias",
    description: "Mesa ratona con laterales trabajados.",
    detailTitle: "Mesa ratona con laterales de celosias",
    detailDescription:
      "Una mesa baja con mas detalle artesanal. Los laterales de celosias suman textura y hacen que la pieza se destaque en el living, sin perder funcionalidad para el uso cotidiano.",
    dimensions: "1.20 x 0.70 x 0.45 mts alto",
    listPrice: 474_000,
    cashPrice: 395_000,
    images: [
      "/catalogo/mesa-ratona-celosias-120/1.jpeg",
      "/catalogo/mesa-ratona-celosias-120/2.jpeg",
      "/catalogo/mesa-ratona-celosias-120/3.jpeg",
    ],
    imageAlt: "Mesa ratona con laterales de celosias",
  },
  {
    id: "mesa-ratona-simple-120",
    name: "Mesa ratona simple",
    description: "Mesa ratona simple de madera maciza.",
    detailTitle: "Mesa ratona simple 1.20 x 0.70 mts",
    detailDescription:
      "Una mesa ratona limpia, funcional y facil de combinar. Su formato simple deja que la madera sea protagonista y la vuelve una pieza muy adaptable para livings de distintos estilos.",
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
      "Una version mas chica, practica y liviana visualmente. Ideal para espacios reducidos o para acompanar un sillon sin cargar el ambiente.",
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
    description: "Cilindros de madera maciza con diametro fijo.",
    detailTitle: "Cilindros de madera maciza",
    detailDescription:
      "Piezas auxiliares versatiles para usar como apoyo, mesa lateral o detalle decorativo. Al venir en distintas alturas, pueden funcionar solas o combinadas para sumar volumen y textura al ambiente.",
    dimensions: "50, 60 y 70 cm alto - diametro 30 cm",
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
