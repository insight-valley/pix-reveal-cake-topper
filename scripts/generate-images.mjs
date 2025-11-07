#!/usr/bin/env node

/**
 * Script para gerar imagens reais para o catálogo de prompts
 * Uso: node scripts/generate-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.API_URL || 'http://localhost:9876';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'prompt-examples');

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Prompts melhorados
const NEW_PROMPTS = [
  {
    id: "anna-luiza-stitch",
    title: "Nome + Personagem (Stitch)",
    category: "Aniversário",
    tags: ["personagem", "infantil", "disney", "colorido"],
    prompt: "Um design de topo de bolo de aniversário com o nome 'Anna Luiza' em português em script cursivo elegante, cor azul escuro, estilo brilhante e amigável. Abaixo do nome, quatro ilustrações fofas de desenho animado do Stitch (do Lilo & Stitch) em poses diferentes: sentado com um pequeno coração vermelho, deitado com patas esticadas para frente, em pé brincando com as mãos nas orelhas, e sorrindo timidamente com corações rosa flutuando ao redor. Use tons vibrantes de azul, roxo e rosa claro para orelhas e corações. Cada elemento deve ter um efeito de contorno branco de adesivo, dando uma aparência limpa de recorte. Foque apenas nos personagens e texto, sem fundo — ideal para topo de bolo ou decoração imprimível.",
  },
  {
    id: "parabens-simples-cursivo",
    title: "Parabéns Simples Cursivo",
    category: "Aniversário",
    tags: ["simples", "elegante", "minimalista", "duas cores"],
    prompt: "Uma marca de palavra em estilo adesivo plano da palavra portuguesa 'Parabéns', escrita em letras cursivas suaves e arredondadas. A cor de preenchimento deve ser um roxo fosco com tons lilás suaves, sem brilho ou reflexos, criando uma estética calma e moderna. O contorno deve ser um roxo ligeiramente mais escuro, e a borda externa branco puro, mantendo contraste e clareza. O estilo geral deve parecer limpo, elegante e minimalista — ideal para letras impressas ou vinil cortado. Foque apenas no texto, sem fundo.",
  },
  {
    id: "maria-frozen-princesa",
    title: "Nome + Frozen (Princesa)",
    category: "Aniversário",
    tags: ["frozen", "princesa", "infantil", "feminino", "disney"],
    prompt: "Design de topo de bolo com o nome 'Maria' em letras cursivas elegantes em azul gelo brilhante com efeito de cristal. Ao redor do nome, elementos do tema Frozen: flocos de neve delicados em diferentes tamanhos, coroa de gelo da Elsa no topo, silhuetas das irmãs Elsa e Anna de cada lado em vestidos de gala. Adicione cristais de gelo, estrelas brilhantes e pequenos detalhes em prata e azul claro. Estilo de adesivo com contorno branco em todos os elementos. Cores: azul gelo, azul royal, prata, branco e toques de rosa suave. Sem fundo, apenas elementos decorativos.",
  },
  {
    id: "feliz-aniversario-baloes",
    title: "Feliz Aniversário com Balões",
    category: "Aniversário",
    tags: ["festivo", "balões", "alegre", "colorido"],
    prompt: "Topo de bolo com a frase 'Feliz Aniversário' em português, em lettering cursivo vibrante com cada palavra em cor diferente (rosa e azul). Ao redor, balões de festa realistas em cores variadas (vermelho, amarelo, verde, azul, rosa) com reflexos brilhantes e fios dourados. Adicione confetes coloridos caindo, estrelas pequenas, uma vela de aniversário acesa no canto, e serpentinas onduladas. Cada elemento com contorno branco de adesivo. Estilo alegre e festivo, cores vibrantes e saturadas. Sem fundo, elementos flutuantes.",
  },
  {
    id: "pedro-futebol",
    title: "Nome + Tema Futebol",
    category: "Aniversário",
    tags: ["futebol", "esporte", "masculino", "infantil"],
    prompt: "Design de topo de bolo com o nome 'Pedro' em letras bold estilo esportivo em verde e amarelo (cores do Brasil). Ao redor, elementos de futebol: bola de futebol realista, chuteira, troféu dourado pequeno, bandeirola de escanteio, apito de árbitro. Adicione estrelas amarelas, campo de futebol estilizado ao fundo (apenas linhas), e número '7' em destaque. Estilo dinâmico com efeito 3D nos elementos principais. Contorno branco em todos os elementos. Cores: verde bandeira, amarelo ouro, azul royal e branco. Sem fundo sólido.",
  },
  {
    id: "50-anos-elegante",
    title: "50 Anos Elegante",
    category: "Aniversário",
    tags: ["adulto", "elegante", "bodas", "dourado"],
    prompt: "Topo de bolo sofisticado com o número '50' em grande destaque, em tipografia serifada elegante com acabamento dourado metalizado e detalhes em relevo. A palavra 'Anos' abaixo em script cursivo delicado. Decorações: moldura art déco ao redor, folhas de louro douradas, pequenos diamantes brilhantes, taças de champagne estilizadas, coroa imperial no topo. Estilo luxuoso e clássico com paleta de dourado, preto e branco. Contorno branco nos elementos. Textura metalizada e brilho sofisticado. Sem fundo.",
  },
  {
    id: "bem-vindos-floral",
    title: "Bem-vindos Floral Delicado",
    category: "Celebração",
    tags: ["floral", "delicado", "natureza", "elegante"],
    prompt: "Topo de bolo com a palavra 'Bem-vindos' em português, em caligrafia cursiva fina e elegante na cor verde-sálvia. Ao redor, arranjo floral delicado com rosas abertas em tons de rosa antigo, eucalipto, folhas de samambaia, pequenas flores silvestres brancas e lavanda. Adicione borboletas delicadas, folhas douradas sutis e galhos entrelaçados. Estilo botânico aquarelado com contornos suaves e brancos. Paleta: verde-sálvia, rosa antigo, branco, toques de dourado. Composição orgânica e romântica. Sem fundo.",
  },
  {
    id: "obrigada-coracao",
    title: "Obrigada com Coração",
    category: "Gratidão",
    tags: ["gratidão", "coração", "delicado", "feminino"],
    prompt: "Design de topo de bolo com a palavra 'Obrigada' em lettering cursivo suave em rosa antigo. Um grande coração decorativo ao centro com padrão rendado delicado, flores pequenas dentro do coração. Ao redor, elementos de gratidão: mãos em prece estilizadas, pequenas flores de cerejeira, borboletas em tons de rosa, pássaros delicados, fitas onduladas. Estilo romântico e delicado com texturas suaves. Contorno branco em todos os elementos. Cores: rosa antigo, rosa claro, lilás suave, branco e toques de dourado rosé. Sem fundo.",
  },
  {
    id: "parabens-unicornio",
    title: "Parabéns Unicórnio Mágico",
    category: "Aniversário",
    tags: ["unicórnio", "mágico", "infantil", "feminino", "fantasia"],
    prompt: "Topo de bolo mágico com a palavra 'Parabéns' em lettering cursivo com efeito arco-íris (gradiente de cores). Elementos principais: cabeça de unicórnio fofa com crina colorida em tons pastel, chifre dourado com glitter, flores na crina, olhos grandes e brilhantes. Ao redor: estrelas coloridas, nuvens fofas, arco-íris pequeno, corações em tons pastel, borboletas, sparkles (brilhos) dourados. Estilo kawaii fofo com cores pastel vibrantes. Contorno branco em todos os elementos. Paleta: rosa, lilás, azul bebê, amarelo suave, dourado. Sem fundo.",
  },
  {
    id: "formatura-medicina",
    title: "Formatura Medicina",
    category: "Formatura",
    tags: ["formatura", "medicina", "profissional", "elegante"],
    prompt: "Topo de bolo de formatura com a palavra 'Formatura' em tipografia serifada elegante em azul marinho. Elementos de medicina: capelo de formatura com borla vermelha, diploma enrolado com fita vermelha, estetoscópio estilizado, símbolo de medicina (caduceu), livros empilhados, cruz médica. Adicione estrelas douradas, louros acadêmicos nas laterais, pequena coruja da sabedoria. Estilo profissional e sofisticado. Cores: azul marinho, vermelho, dourado, branco. Contorno branco nos elementos. Textura premium com leve brilho. Sem fundo.",
  },
  {
    id: "love-you-moderno",
    title: "Love You Moderno",
    category: "Amor",
    tags: ["amor", "moderno", "romântico", "minimalista"],
    prompt: "Design moderno de topo de bolo com a frase 'Love You' em tipografia sans-serif geométrica bold em vermelho intenso. Elementos minimalistas: coração geométrico grande com linhas limpas, setas de cupido estilizadas, iniciais entrelaçadas em círculo dourado, pequenos corações flutuantes em tamanhos variados. Estilo contemporâneo e clean. Paleta limitada: vermelho, rosa, dourado e branco. Contorno branco fino nos elementos principais. Composição equilibrada e moderna. Sem fundo.",
  },
  {
    id: "casamento-elegante",
    title: "Feliz Casamento Clássico",
    category: "Casamento",
    tags: ["casamento", "elegante", "clássico", "romântico"],
    prompt: "Topo de bolo de casamento com a frase 'Feliz Casamento' em caligrafia cursiva clássica em dourado. Elementos matrimoniais: par de alianças entrelaçadas em ouro, pombas brancas com ramo de oliveira, coração ornamentado no centro, arco floral com rosas brancas e folhagem prateada. Adicione pérolas delicadas, renda sutil, sino de casamento pequeno, taças de champagne. Estilo romântico clássico com detalhes luxuosos. Cores: dourado, branco puro, prata, toques de verde suave. Contorno branco elegante. Sem fundo.",
  },
  {
    id: "cha-bebe-neutro",
    title: "Chá de Bebê Neutro",
    category: "Celebração",
    tags: ["chá de bebê", "neutro", "delicado", "infantil"],
    prompt: "Topo de bolo para chá de bebê com a frase 'Bem-vindo Baby' em lettering cursivo suave em bege claro. Elementos fofos: chupeta estilizada, mamadeira, carrinho de bebê vintage, bloco de alfabeto, ursinho de pelúcia, chocalho, sapatinhos de bebê, estrelas e luas. Decoração com folhagem delicada, nuvens fofas, arco-íris suave. Estilo neutro e delicado, sem definir gênero. Paleta: bege, cinza claro, branco, amarelo suave, verde menta. Contorno branco. Atmosfera calma e acolhedora. Sem fundo.",
  },
  {
    id: "parabens-minecraft",
    title: "Parabéns Minecraft",
    category: "Aniversário",
    tags: ["minecraft", "games", "infantil", "masculino"],
    prompt: "Topo de bolo com tema Minecraft com a palavra 'Parabéns' em fonte pixelada estilo 8-bit em verde. Elementos do jogo: cabeça do Creeper (rosto pixelado verde), blocos de grama, picareta de diamante, espada pixelada, tocha, bloco de TNT, esmeralda brilhante, portal do Nether estilizado. Adicione elementos pixelados: corações pixelados vermelhos, estrelas em formato de bloco, cristais. Estilo pixel art com cores vibrantes e saturadas. Contorno preto nos elementos. Paleta: verde, marrom, azul diamante, vermelho, cinza. Sem fundo.",
  },
  {
    id: "feliz-pascoa",
    title: "Feliz Páscoa Colorida",
    category: "Celebração",
    tags: ["páscoa", "coelho", "festivo", "infantil"],
    prompt: "Topo de bolo de Páscoa com a frase 'Feliz Páscoa' em lettering cursivo colorido e alegre. Elementos: coelho fofo branco com laço rosa, ovos de Páscoa decorados com padrões variados (listras, bolinhas, flores), cenouras estilizadas, cesta de vime com ovos, flores da primavera (tulipas, margaridas), pintinhos amarelos fofos, borboletas. Estilo alegre e festivo com cores pastel vibrantes. Contorno branco em todos os elementos. Paleta: rosa, lilás, amarelo, verde, azul bebê, laranja suave. Sem fundo.",
  }
];

async function generateImage(promptData) {
  console.log(`\n🎨 Gerando imagem para: ${promptData.title}`);
  console.log(`📝 Prompt: ${promptData.prompt.substring(0, 100)}...`);

  try {
    const response = await fetch(`${API_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptData.prompt,
        imageUrl: 'placeholder', // Requerido mas não usado para gerar
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.imageUrl) {
      throw new Error('No image URL in response');
    }

    // Salvar imagem localmente
    const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${promptData.id}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Imagem salva: ${filename} (${Math.round(buffer.length / 1024)}KB)`);

    return {
      success: true,
      filename,
      filepath,
      size: buffer.length,
    };
  } catch (error) {
    console.error(`❌ Erro ao gerar imagem: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function generateAllImages() {
  console.log('🚀 Iniciando geração de imagens para o catálogo de prompts');
  console.log(`📁 Diretório de saída: ${OUTPUT_DIR}`);
  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`📊 Total de prompts: ${NEW_PROMPTS.length}`);

  const results = [];

  for (let i = 0; i < NEW_PROMPTS.length; i++) {
    const prompt = NEW_PROMPTS[i];
    console.log(`\n[${i + 1}/${NEW_PROMPTS.length}] Processando: ${prompt.id}`);
    
    const result = await generateImage(prompt);
    results.push({
      ...prompt,
      ...result,
    });

    // Aguardar um pouco entre requisições para não sobrecarregar
    if (i < NEW_PROMPTS.length - 1) {
      console.log('⏳ Aguardando 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Relatório final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Geradas com sucesso: ${successful.length}`);
  console.log(`❌ Falhas: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n❌ Prompts que falharam:');
    failed.forEach(f => {
      console.log(`  - ${f.id}: ${f.error}`);
    });
  }

  // Salvar resumo em JSON
  const summaryPath = path.join(OUTPUT_DIR, 'generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Resumo salvo em: ${summaryPath}`);

  console.log('\n✨ Processo concluído!');
}

// Executar
generateAllImages().catch(console.error);
