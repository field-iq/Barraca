export interface StandardFurnitureItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  detailTitle: string;
  detailTitleEn?: string;
  detailDescription: string;
  detailDescriptionEn?: string;
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
    nameEn: "Dining table",
    description: "Mesa de madera maciza con medida estándar.",
    descriptionEn: "Solid wood table in a standard size.",
    detailTitle: "Mesa comedor 2.00 x 1.00 mts",
    detailTitleEn: "Dining table 2.00 x 1.00 m",
    detailDescription:
      "Una mesa de comedor firme, cálida y de escala muy cómoda para el uso diario. Esta medida funciona muy bien en comedores familiares y espacios integrados, con presencia de madera maciza y una terminación pensada para acompañar muchos años de reuniones.",
    detailDescriptionEn:
      "A sturdy, warm dining table with a scale that's very comfortable for everyday use. This size works great in family dining rooms and open-plan spaces, with the presence of solid wood and a finish made to accompany many years of gatherings.",
    dimensions: "2.00 x 1.00 mts",
    listPrice: 1_140_000,
    cashPrice: 950_000,
    images: ["/catalogo/mesa-comedor-200/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 2.00 x 1.00 mts",
  },
  {
    id: "mesa-comedor-240",
    name: "Mesa comedor",
    nameEn: "Dining table",
    description: "Mesa amplia de madera maciza para comedor.",
    descriptionEn: "Spacious solid wood dining table.",
    detailTitle: "Mesa comedor 2.40 x 1.20 mts",
    detailTitleEn: "Dining table 2.40 x 1.20 m",
    detailDescription:
      "Una mesa protagonista para comedores amplios. Sus proporciones permiten sentarse con comodidad y lucen especialmente bien en espacios donde la madera puede tomar protagonismo. Ideal para casas que viven alrededor de la mesa.",
    detailDescriptionEn:
      "A statement table for large dining rooms. Its proportions allow comfortable seating and look especially good in spaces where the wood can take center stage. Ideal for homes that gather around the table.",
    dimensions: "2.40 x 1.20 mts",
    listPrice: 1_620_000,
    cashPrice: 1_350_000,
    images: ["/catalogo/mesa-comedor-240/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 2.40 x 1.20 mts",
  },
  {
    id: "mesa-comedor-160",
    name: "Mesa comedor",
    nameEn: "Dining table",
    description: "Mesa compacta de madera maciza para espacios chicos.",
    descriptionEn: "Compact solid wood table for smaller spaces.",
    detailTitle: "Mesa comedor 1.60 x 0.80 mts",
    detailTitleEn: "Dining table 1.60 x 0.80 m",
    detailDescription:
      "Una opción compacta y práctica para departamentos, cocinas comedor o ambientes más chicos. Mantiene la presencia de una mesa de madera maciza, pero con una medida fácil de ubicar y de usar todos los días.",
    detailDescriptionEn:
      "A compact, practical option for apartments, eat-in kitchens or smaller rooms. It keeps the presence of a solid wood table, but in a size that's easy to fit in and use every day.",
    dimensions: "1.60 x 0.80 mts",
    listPrice: 828_000,
    cashPrice: 690_000,
    images: ["/catalogo/mesa-comedor-160/1.jpeg"],
    imageAlt: "Mesa comedor de madera maciza de 1.60 x 0.80 mts",
  },
  {
    id: "camastro-160",
    name: "Camastro",
    nameEn: "Daybed",
    description: "Camastro de madera con profundidad estándar.",
    descriptionEn: "Wooden daybed with a standard depth.",
    detailTitle: "Camastro 1.60 x 0.60 mts",
    detailTitleEn: "Daybed 1.60 x 0.60 m",
    detailDescription:
      "Un camastro robusto para armar un rincón de descanso en galería, living o espacio semicubierto. La madera aporta peso visual y calidez, y la profundidad permite usarlo como asiento amplio o pieza de apoyo.",
    detailDescriptionEn:
      "A sturdy daybed for setting up a resting corner on a porch, living room or semi-covered space. The wood adds visual weight and warmth, and the depth lets it work as a roomy seat or a support piece.",
    dimensions: "1.60 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-180",
    name: "Camastro",
    nameEn: "Daybed",
    description: "Camastro de madera con profundidad estándar.",
    descriptionEn: "Wooden daybed with a standard depth.",
    detailTitle: "Camastro 1.80 x 0.60 mts",
    detailTitleEn: "Daybed 1.80 x 0.60 m",
    detailDescription:
      "Una medida versátil para quienes quieren un camastro con más presencia sin ocupar demasiado. Funciona bien con almohadones y textiles, y suma una base noble para espacios de descanso.",
    detailDescriptionEn:
      "A versatile size for those who want a daybed with more presence without taking up too much room. It works well with cushions and textiles, and adds a fine base for resting spaces.",
    dimensions: "1.80 x 0.60 mts prof.",
    listPrice: 900_000,
    cashPrice: 750_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro de madera maciza",
  },
  {
    id: "camastro-200",
    name: "Camastro",
    nameEn: "Daybed",
    description: "Camastro de madera con profundidad estándar.",
    descriptionEn: "Wooden daybed with a standard depth.",
    detailTitle: "Camastro 2.00 x 0.60 mts",
    detailTitleEn: "Daybed 2.00 x 0.60 m",
    detailDescription:
      "El camastro más largo de la línea estándar. Es ideal para galerías o livings amplios donde se busca una pieza de madera importante, cómoda y con mucha presencia.",
    detailDescriptionEn:
      "The longest daybed in the standard line. It's ideal for porches or large living rooms looking for a substantial wood piece that's comfortable and has plenty of presence.",
    dimensions: "2.00 x 0.60 mts prof.",
    listPrice: 1_020_000,
    cashPrice: 850_000,
    images: ["/catalogo/camastros/1.jpeg", "/catalogo/camastros/2.jpeg"],
    imageAlt: "Camastro grande de madera maciza",
  },
  {
    id: "mesa-ratona-celosias-120",
    name: "Mesa ratona con laterales de celosías",
    nameEn: "Coffee table with lattice sides",
    description: "Mesa ratona con laterales trabajados.",
    descriptionEn: "Coffee table with detailed side panels.",
    detailTitle: "Mesa ratona con laterales de celosías",
    detailTitleEn: "Coffee table with lattice sides",
    detailDescription:
      "Una mesa baja con más detalle artesanal. Los laterales de celosías suman textura y hacen que la pieza se destaque en el living, sin perder funcionalidad para el uso cotidiano.",
    detailDescriptionEn:
      "A low table with more handcrafted detail. The lattice sides add texture and make the piece stand out in the living room, without losing everyday functionality.",
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
    nameEn: "Simple coffee table",
    description: "Mesa ratona simple de madera maciza.",
    descriptionEn: "Simple solid wood coffee table.",
    detailTitle: "Mesa ratona simple 1.20 x 0.70 mts",
    detailTitleEn: "Simple coffee table 1.20 x 0.70 m",
    detailDescription:
      "Una mesa ratona limpia, funcional y fácil de combinar. Su formato simple deja que la madera sea protagonista y la vuelve una pieza muy adaptable para livings de distintos estilos.",
    detailDescriptionEn:
      "A clean, functional coffee table that's easy to combine with other pieces. Its simple shape lets the wood take center stage and makes it a very adaptable piece for living rooms of different styles.",
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
    nameEn: "Coffee table",
    description: "Mesa ratona chica de madera maciza.",
    descriptionEn: "Small solid wood coffee table.",
    detailTitle: "Mesa ratona 1.00 x 0.50 mts",
    detailTitleEn: "Coffee table 1.00 x 0.50 m",
    detailDescription:
      "Una versión más chica, práctica y liviana visualmente. Ideal para espacios reducidos o para acompañar un sillón sin cargar el ambiente.",
    detailDescriptionEn:
      "A smaller version, practical and visually light. Ideal for tight spaces or to sit alongside an armchair without crowding the room.",
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
    nameEn: "Cylinders",
    description: "Cilindros de madera maciza con diámetro fijo.",
    descriptionEn: "Solid wood cylinders with a fixed diameter.",
    detailTitle: "Cilindros de madera maciza",
    detailTitleEn: "Solid wood cylinders",
    detailDescription:
      "Piezas auxiliares versátiles para usar como apoyo, mesa lateral o detalle decorativo. Al venir en distintas alturas, pueden funcionar solas o combinadas para sumar volumen y textura al ambiente.",
    detailDescriptionEn:
      "Versatile accent pieces to use as a stool, side table or decorative detail. Coming in different heights, they can work alone or combined to add volume and texture to a room.",
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
