export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  imageUrl: string;
  tags?: string[];
}

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

// Categorias organizadas
export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "aniversario",
    name: "Aniversário",
    description: "Celebrações de aniversário e idade",
    color: "bg-red-500",
  },
  {
    id: "amor",
    name: "Amor",
    description: "Declarações românticas e carinho",
    color: "bg-pink-500",
  },
  {
    id: "formatura",
    name: "Formatura",
    description: "Conquistas acadêmicas e profissionais",
    color: "bg-blue-500",
  },
  {
    id: "celebracao",
    name: "Celebração",
    description: "Festividades gerais e eventos especiais",
    color: "bg-green-500",
  },
  {
    id: "gratidao",
    name: "Gratidão",
    description: "Agradecimentos e reconhecimento",
    color: "bg-purple-500",
  },
  {
    id: "casamento",
    name: "Casamento",
    description: "Cerimônias e celebrações matrimoniais",
    color: "bg-yellow-500",
  },
];

// Catálogo completo de prompts com imagens reais geradas
export const PROMPT_CATALOG: PromptItem[] = [
  {
    id: "parabens-simples-cursivo",
    title: "Parabéns Simples Cursivo",
    category: "Aniversário",
    tags: ["simples", "elegante", "minimalista", "duas cores"],
    prompt:
      "Uma marca de palavra em estilo adesivo plano da palavra portuguesa 'Parabéns', escrita em letras cursivas suaves e arredondadas. A cor de preenchimento deve ser um roxo fosco com tons lilás suaves, sem brilho ou reflexos, criando uma estética calma e moderna. O contorno deve ser um roxo ligeiramente mais escuro, e a borda externa branco puro, mantendo contraste e clareza. O estilo geral deve parecer limpo, elegante e minimalista — ideal para letras impressas ou vinil cortado. Foque apenas no texto, sem fundo.",
    imageUrl: "/prompt-examples/parabens-simples-cursivo.png",
  },
  {
    id: "maria-frozen-princesa",
    title: "Nome + Frozen (Princesa)",
    category: "Aniversário",
    tags: ["frozen", "princesa", "infantil", "feminino", "disney"],
    prompt:
      "Design de topo de bolo com o nome 'Maria' em letras cursivas elegantes em azul gelo brilhante com efeito de cristal. Ao redor do nome, elementos do tema Frozen: flocos de neve delicados em diferentes tamanhos, coroa de gelo da Elsa no topo, silhuetas das irmãs Elsa e Anna de cada lado em vestidos de gala. Adicione cristais de gelo, estrelas brilhantes e pequenos detalhes em prata e azul claro. Estilo de adesivo com contorno branco em todos os elementos. Cores: azul gelo, azul royal, prata, branco e toques de rosa suave. Sem fundo, apenas elementos decorativos.",
    imageUrl: "/prompt-examples/maria-frozen-princesa.png",
  },
  {
    id: "feliz-aniversario-baloes",
    title: "Feliz Aniversário com Balões",
    category: "Aniversário",
    tags: ["festivo", "balões", "alegre", "colorido"],
    prompt:
      "Topo de bolo com a frase 'Feliz Aniversário' em português, em lettering cursivo vibrante com cada palavra em cor diferente (rosa e azul). Ao redor, balões de festa realistas em cores variadas (vermelho, amarelo, verde, azul, rosa) com reflexos brilhantes e fios dourados. Adicione confetes coloridos caindo, estrelas pequenas, uma vela de aniversário acesa no canto, e serpentinas onduladas. Cada elemento com contorno branco de adesivo. Estilo alegre e festivo, cores vibrantes e saturadas. Sem fundo, elementos flutuantes.",
    imageUrl: "/prompt-examples/feliz-aniversario-baloes.png",
  },
  {
    id: "pedro-futebol",
    title: "Nome + Tema Futebol",
    category: "Aniversário",
    tags: ["futebol", "esporte", "masculino", "infantil"],
    prompt:
      "Design de topo de bolo com o nome 'Pedro' em letras bold estilo esportivo em verde e amarelo (cores do Brasil). Ao redor, elementos de futebol: bola de futebol realista, chuteira, troféu dourado pequeno, bandeirola de escanteio, apito de árbitro. Adicione estrelas amarelas, campo de futebol estilizado ao fundo (apenas linhas), e número '7' em destaque. Estilo dinâmico com efeito 3D nos elementos principais. Contorno branco em todos os elementos. Cores: verde bandeira, amarelo ouro, azul royal e branco. Sem fundo sólido.",
    imageUrl: "/prompt-examples/pedro-futebol.png",
  },
  {
    id: "50-anos-elegante",
    title: "50 Anos Elegante",
    category: "Aniversário",
    tags: ["adulto", "elegante", "bodas", "dourado"],
    prompt:
      "Topo de bolo sofisticado com o número '50' em grande destaque, em tipografia serifada elegante com acabamento dourado metalizado e detalhes em relevo. A palavra 'Anos' abaixo em script cursivo delicado. Decorações: moldura art déco ao redor, folhas de louro douradas, pequenos diamantes brilhantes, taças de champagne estilizadas, coroa imperial no topo. Estilo luxuoso e clássico com paleta de dourado, preto e branco. Contorno branco nos elementos. Textura metalizada e brilho sofisticado. Sem fundo.",
    imageUrl: "/prompt-examples/50-anos-elegante.png",
  },
  {
    id: "parabens-unicornio",
    title: "Parabéns Unicórnio Mágico",
    category: "Aniversário",
    tags: ["unicórnio", "mágico", "infantil", "feminino", "fantasia"],
    prompt:
      "Topo de bolo mágico com a palavra 'Parabéns' em lettering cursivo com efeito arco-íris (gradiente de cores). Elementos principais: cabeça de unicórnio fofa com crina colorida em tons pastel, chifre dourado com glitter, flores na crina, olhos grandes e brilhantes. Ao redor: estrelas coloridas, nuvens fofas, arco-íris pequeno, corações em tons pastel, borboletas, sparkles (brilhos) dourados. Estilo kawaii fofo com cores pastel vibrantes. Contorno branco em todos os elementos. Paleta: rosa, lilás, azul bebê, amarelo suave, dourado. Sem fundo.",
    imageUrl: "/prompt-examples/parabens-unicornio.png",
  },
  {
    id: "parabens-minecraft",
    title: "Parabéns Minecraft",
    category: "Aniversário",
    tags: ["minecraft", "games", "infantil", "masculino"],
    prompt:
      "Topo de bolo com tema Minecraft com a palavra 'Parabéns' em fonte pixelada estilo 8-bit em verde. Elementos do jogo: cabeça do Creeper (rosto pixelado verde), blocos de grama, picareta de diamante, espada pixelada, tocha, bloco de TNT, esmeralda brilhante, portal do Nether estilizado. Adicione elementos pixelados: corações pixelados vermelhos, estrelas em formato de bloco, cristais. Estilo pixel art com cores vibrantes e saturadas. Contorno preto nos elementos. Paleta: verde, marrom, azul diamante, vermelho, cinza. Sem fundo.",
    imageUrl: "/prompt-examples/parabens-minecraft.png",
  },
  {
    id: "love-you-moderno",
    title: "Love You Moderno",
    category: "Amor",
    tags: ["amor", "moderno", "romântico", "minimalista"],
    prompt:
      "Design moderno de topo de bolo com a frase 'Love You' em tipografia sans-serif geométrica bold em vermelho intenso. Elementos minimalistas: coração geométrico grande com linhas limpas, setas de cupido estilizadas, iniciais entrelaçadas em círculo dourado, pequenos corações flutuantes em tamanhos variados. Estilo contemporâneo e clean. Paleta limitada: vermelho, rosa, dourado e branco. Contorno branco fino nos elementos principais. Composição equilibrada e moderna. Sem fundo.",
    imageUrl: "/prompt-examples/love-you-moderno.png",
  },
  {
    id: "formatura-medicina",
    title: "Formatura Medicina",
    category: "Formatura",
    tags: ["formatura", "medicina", "profissional", "elegante"],
    prompt:
      "Topo de bolo de formatura com a palavra 'Formatura' em tipografia serifada elegante em azul marinho. Elementos de medicina: capelo de formatura com borla vermelha, diploma enrolado com fita vermelha, estetoscópio estilizado, símbolo de medicina (caduceu), livros empilhados, cruz médica. Adicione estrelas douradas, louros acadêmicos nas laterais, pequena coruja da sabedoria. Estilo profissional e sofisticado. Cores: azul marinho, vermelho, dourado, branco. Contorno branco nos elementos. Textura premium com leve brilho. Sem fundo.",
    imageUrl: "/prompt-examples/formatura-medicina.png",
  },
  {
    id: "bem-vindos-floral",
    title: "Bem-vindos Floral Delicado",
    category: "Celebração",
    tags: ["floral", "delicado", "natureza", "elegante"],
    prompt:
      "Topo de bolo com a palavra 'Bem-vindos' em português, em caligrafia cursiva fina e elegante na cor verde-sálvia. Ao redor, arranjo floral delicado com rosas abertas em tons de rosa antigo, eucalipto, folhas de samambaia, pequenas flores silvestres brancas e lavanda. Adicione borboletas delicadas, folhas douradas sutis e galhos entrelaçados. Estilo botânico aquarelado com contornos suaves e brancos. Paleta: verde-sálvia, rosa antigo, branco, toques de dourado. Composição orgânica e romântica. Sem fundo.",
    imageUrl: "/prompt-examples/bem-vindos-floral.png",
  },
  {
    id: "feliz-pascoa",
    title: "Feliz Páscoa Colorida",
    category: "Celebração",
    tags: ["páscoa", "coelho", "festivo", "infantil"],
    prompt:
      "Topo de bolo de Páscoa com a frase 'Feliz Páscoa' em lettering cursivo colorido e alegre. Elementos: coelho fofo branco com laço rosa, ovos de Páscoa decorados com padrões variados (listras, bolinhas, flores), cenouras estilizadas, cesta de vime com ovos, flores da primavera (tulipas, margaridas), pintinhos amarelos fofos, borboletas. Estilo alegre e festivo com cores pastel vibrantes. Contorno branco em todos os elementos. Paleta: rosa, lilás, amarelo, verde, azul bebê, laranja suave. Sem fundo.",
    imageUrl: "/prompt-examples/feliz-pascoa.png",
  },
  {
    id: "cha-bebe-neutro",
    title: "Chá de Bebê Neutro",
    category: "Celebração",
    tags: ["chá de bebê", "neutro", "delicado", "infantil"],
    prompt:
      "Topo de bolo para chá de bebê com a frase 'Bem-vindo Baby' em lettering cursivo suave em bege claro. Elementos fofos: chupeta estilizada, mamadeira, carrinho de bebê vintage, bloco de alfabeto, ursinho de pelúcia, chocalho, sapatinhos de bebê, estrelas e luas. Decoração com folhagem delicada, nuvens fofas, arco-íris suave. Estilo neutro e delicado, sem definir gênero. Paleta: bege, cinza claro, branco, amarelo suave, verde menta. Contorno branco. Atmosfera calma e acolhedora. Sem fundo.",
    imageUrl: "/prompt-examples/cha-bebe-neutro.png",
  },
  {
    id: "obrigada-coracao",
    title: "Obrigada com Coração",
    category: "Gratidão",
    tags: ["gratidão", "coração", "delicado", "feminino"],
    prompt:
      "Design de topo de bolo com a palavra 'Obrigada' em lettering cursivo suave em rosa antigo. Um grande coração decorativo ao centro com padrão rendado delicado, flores pequenas dentro do coração. Ao redor, elementos de gratidão: mãos em prece estilizadas, pequenas flores de cerejeira, borboletas em tons de rosa, pássaros delicados, fitas onduladas. Estilo romântico e delicado com texturas suaves. Contorno branco em todos os elementos. Cores: rosa antigo, rosa claro, lilás suave, branco e toques de dourado rosé. Sem fundo.",
    imageUrl: "/prompt-examples/obrigada-coracao.png",
  },
  {
    id: "casamento-elegante",
    title: "Feliz Casamento Clássico",
    category: "Casamento",
    tags: ["casamento", "elegante", "clássico", "romântico"],
    prompt:
      "Topo de bolo de casamento com a frase 'Feliz Casamento' em caligrafia cursiva clássica em dourado. Elementos matrimoniais: par de alianças entrelaçadas em ouro, pombas brancas com ramo de oliveira, coração ornamentado no centro, arco floral com rosas brancas e folhagem prateada. Adicione pérolas delicadas, renda sutil, sino de casamento pequeno, taças de champagne. Estilo romântico clássico com detalhes luxuosos. Cores: dourado, branco puro, prata, toques de verde suave. Contorno branco elegante. Sem fundo.",
    imageUrl: "/prompt-examples/casamento-elegante.png",
  },
];

// Textos de exemplo para inputs rápidos
export const EXAMPLE_TEXTS = [
  "Parabéns",
  "Feliz Aniversário",
  "Happy Birthday",
  "Ana 25 Anos",
  "Bem-vindos",
  "Obrigada",
  "Love You",
  "Congratulations",
  "Feliz Casamento",
  "Formatura 2024",
];

// Funções utilitárias para trabalhar com os prompts
export const getPromptsByCategory = (categoryId: string): PromptItem[] => {
  if (categoryId === "todos") return PROMPT_CATALOG;
  const category = PROMPT_CATEGORIES.find((cat) => cat.id === categoryId);
  if (!category) return [];
  return PROMPT_CATALOG.filter((prompt) => prompt.category === category.name);
};

export const searchPrompts = (searchTerm: string): PromptItem[] => {
  const term = searchTerm.toLowerCase();
  return PROMPT_CATALOG.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(term) ||
      prompt.category.toLowerCase().includes(term) ||
      prompt.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
      prompt.prompt.toLowerCase().includes(term)
  );
};

export const getPromptById = (id: string): PromptItem | undefined => {
  return PROMPT_CATALOG.find((prompt) => prompt.id === id);
};

export const getCategoryByName = (name: string): PromptCategory | undefined => {
  return PROMPT_CATEGORIES.find((cat) => cat.name === name);
};
