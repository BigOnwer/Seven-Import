export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  emoji: string;
  tag: string | null;
  stars: number;
  reviews: number;
  desc: string;
  longDesc: string;
  colors: string[];
  colorNames: string[];
  sizes: number[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  images: string[]; // emoji placeholders
  details: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "air-force-1-lv",
    name: "Air Force 1 × LV",
    brand: "Nike × Louis Vuitton",
    category: "Nike",
    price: 899,
    oldPrice: 1199,
    emoji: "👟",
    tag: "Lançamento",
    stars: 5.0,
    reviews: 48,
    desc: "Collab icônica LV × Nike",
    longDesc: "A colaboração mais esperada do streetwear mundial. O clássico Air Force 1 encontra o luxo atemporal da Louis Vuitton em uma peça que redefine o que significa usar tênis premium. Construído com materiais de altíssima qualidade, este par é ao mesmo tempo wearable art e símbolo de status.",
    colors: ["#F5C518", "#111111", "#ffffff"],
    colorNames: ["Yellow", "Black", "White"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    inStock: true,
    isNew: true,
    isSale: true,
    images: ["👟", "✨", "💛", "🔥"],
    details: ["Cabedal em couro premium", "Sola Air original Nike", "Palmilha acolchoada", "Monograma LV gravado", "Caixa exclusiva inclusa"],
  },
  {
    id: 2,
    slug: "jordan-4-yellow-thunder",
    name: "Jordan 4 Yellow Thunder",
    brand: "Air Jordan",
    category: "Jordan",
    price: 1249,
    oldPrice: null,
    emoji: "🏀",
    tag: "Exclusivo",
    stars: 4.9,
    reviews: 31,
    desc: "Yellow & Black · Edição limitada",
    longDesc: "O Jordan 4 Yellow Thunder é uma das colorways mais icônicas da história do basquete e do streetwear. Com o amarelo vibrante cortando o preto profundo, este par é presença garantida em qualquer look. Edição limitada com numeração certificada.",
    colors: ["#F5D000", "#111111"],
    colorNames: ["Yellow Thunder", "Black"],
    sizes: [39, 40, 41, 42, 43, 44],
    inStock: true,
    isNew: false,
    isSale: false,
    images: ["🏀", "⚡", "🖤", "💛"],
    details: ["Cabedal em couro e camurça", "Tecnologia Air na entressola", "Palmilha com suporte de tornozelo", "Lace locks originais", "Numeração de edição limitada"],
  },
  {
    id: 3,
    slug: "air-max-plus-tn",
    name: "Air Max Plus TN",
    brand: "Nike",
    category: "Nike",
    price: 699,
    oldPrice: 849,
    emoji: "⚡",
    tag: "Mais vendido",
    stars: 4.8,
    reviews: 92,
    desc: "TN clássico em várias cores",
    longDesc: "O Air Max Plus — carinhosamente chamado de TN — é um dos tênis mais queridos das ruas brasileiras. O design de ondas no cabedal e a unidade Air visível fazem deste par um clássico atemporal. Disponível nas colorways mais procuradas do mercado.",
    colors: ["#00CFFF", "#111111", "#F5C518", "#22C55E"],
    colorNames: ["Blue Fury", "Black", "Yellow", "Green"],
    sizes: [38, 39, 40, 41, 42, 43],
    inStock: true,
    isNew: false,
    isSale: true,
    images: ["⚡", "💨", "🌊", "🔵"],
    details: ["Unidade Air Max visível", "Cabedal com ondas em gradiente", "Entressola com amortecimento total", "Sola em borracha resistente", "Disponível em múltiplas cores"],
  },
  {
    id: 4,
    slug: "air-force-1-off-white-green",
    name: "Air Force 1 Green",
    brand: "Nike × Off-White",
    category: "Off-White",
    price: 799,
    oldPrice: 999,
    emoji: "💚",
    tag: "Off-White",
    stars: 5.0,
    reviews: 27,
    desc: "Verde vibrante com detalhe Off-White",
    longDesc: "A parceria mais revolucionária da moda streetwear chegou em verde. Virgil Abloh transformou o Air Force 1 em objeto de arte com os detalhes de desconstrução que se tornaram sua assinatura. As zip ties, o texto \"AIR\" na sola e os acabamentos deslocados fazem deste par único.",
    colors: ["#22C55E", "#ffffff"],
    colorNames: ["Green Strike", "White"],
    sizes: [40, 41, 42, 43, 44],
    inStock: true,
    isNew: false,
    isSale: true,
    images: ["💚", "🤍", "✔️", "🌿"],
    details: ["Design Off-White com detalhes desconstruídos", "Zip tie Off-White inclusa", "Texto \"AIR\" gravado na sola", "Cabedal em couro premium", "Caixa laranja Off-White"],
  },
  {
    id: 5,
    slug: "sb-dunk-low-pro",
    name: "SB Dunk Low Pro",
    brand: "Nike SB",
    category: "Nike",
    price: 649,
    oldPrice: null,
    emoji: "🛹",
    tag: "Novo",
    stars: 4.7,
    reviews: 19,
    desc: "Street style puro",
    longDesc: "O SB Dunk Low Pro é a evolução do tênis de skate que conquistou as ruas do mundo. Com acolchoamento extra no colarinho para proteger o tornozelo durante as manobras e uma sola de borracha com aderência aumentada, ele é tão funcional quanto estiloso.",
    colors: ["#ffffff", "#111111", "#e74c3c"],
    colorNames: ["White", "Black", "Red"],
    sizes: [38, 39, 40, 41, 42],
    inStock: true,
    isNew: true,
    isSale: false,
    images: ["🛹", "🖤", "❤️", "🤍"],
    details: ["Acolchoamento extra no colarinho", "Entressola de espuma SB", "Sola de borracha com aderência premium", "Língua dupla acolchoada", "Palmilha removível Zoom Air"],
  },
  {
    id: 6,
    slug: "timberland-6-inch",
    name: "Timberland 6-Inch Boot",
    brand: "Timberland",
    category: "Timberland",
    price: 849,
    oldPrice: 1099,
    emoji: "🥾",
    tag: "Premium",
    stars: 4.9,
    reviews: 55,
    desc: "Bota icônica em couro premium",
    longDesc: "A bota que virou símbolo cultural. O Timberland 6-Inch nasceu para trabalho pesado mas conquistou as ruas globais. Construído com couro bovino impermeável premium e entressola anti-fadiga, ele é o parceiro perfeito para quem não abre mão de qualidade e estilo.",
    colors: ["#C8A96E", "#111111", "#8B4513"],
    colorNames: ["Wheat", "Black", "Dark Brown"],
    sizes: [39, 40, 41, 42, 43, 44],
    inStock: true,
    isNew: false,
    isSale: true,
    images: ["🥾", "🌾", "🤎", "🔶"],
    details: ["Couro bovino impermeável premium", "Entressola anti-fadiga", "Sola Lug em borracha resistente", "Forro de camurça interno", "Cadarços encerados originais"],
  },
  {
    id: 7,
    slug: "vans-old-skool-checkerboard",
    name: "Old Skool Checkerboard",
    brand: "Vans",
    category: "Vans",
    price: 449,
    oldPrice: 549,
    emoji: "♟️",
    tag: "Clássico",
    stars: 4.6,
    reviews: 73,
    desc: "Xadrez clássico Vans",
    longDesc: "O Old Skool Checkerboard é o tênis que atravessou décadas sem perder relevância. O padrão xadrez preto e branco virou símbolo da contracultura e hoje é peça essencial em qualquer guarda-roupa. Lona reforçada, sola vulcanizada e estilo para a vida toda.",
    colors: ["#111111", "#ffffff"],
    colorNames: ["Black/White Checker"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    inStock: true,
    isNew: false,
    isSale: true,
    images: ["♟️", "🏁", "🖤", "🤍"],
    details: ["Lona de algodão reforçada", "Sola vulcanizada Vans", "Biqueira de borracha", "Forro de tecido interno", "Palmilha acolchoada"],
  },
  {
    id: 8,
    slug: "air-max-95-neon",
    name: "Air Max 95 Neon",
    brand: "Nike",
    category: "Nike",
    price: 949,
    oldPrice: 1149,
    emoji: "🟡",
    tag: "Raro",
    stars: 5.0,
    reviews: 14,
    desc: "Neon Yellow · Super raro",
    longDesc: "O Air Max 95 Neon é considerado por muitos o Air Max mais bonito já criado. Inspirado na anatomia humana, com camadas representando músculos e nervos, o Neon (OG) é um dos pares mais cobiçados por colecionadores do mundo inteiro.",
    colors: ["#CCFF00", "#111111", "#888888"],
    colorNames: ["Neon Yellow", "Black", "Cool Grey"],
    sizes: [40, 41, 42, 43, 44],
    inStock: true,
    isNew: false,
    isSale: true,
    images: ["🟡", "⚡", "💛", "🌟"],
    details: ["Cabedal em camadas inspirado na anatomia", "Múltiplas unidades Air Max", "Malha respirável no cabedal", "Entressola de espuma dupla", "Colorway OG original"],
  },
];

export const categories = ["Todos", "Nike", "Jordan", "Off-White", "Vans", "Timberland"];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}
