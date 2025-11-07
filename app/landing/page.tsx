"use client";

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Clock,
  DollarSign,
  Zap,
  CheckCircle2,
  ArrowRight,
  ImageIcon,
  Palette,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // Dispara confetti sutil após 500ms
    const timer = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#ec4899", "#a855f7", "#f472b6"],
        startVelocity: 20,
        gravity: 0.5,
        scalar: 0.8,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* DOBRA 1: HERO - Proposta de Valor com Confetti */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <Confetti
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none z-50"
          manualstart
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">
                Tecnologia de IA Avançada
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Crie Topos de Bolo
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Profissionais em Minutos
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              <strong>
                Chega de templates genéricos do Pinterest e Canva!
              </strong>
              <br />
              Crie designs{" "}
              <span className="text-pink-600 font-bold">
                verdadeiramente únicos
              </span>{" "}
              com IA.
              <br />
              Economize <strong>até R$150</strong> e <strong>7 dias</strong> de
              espera.
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Criar Meu Topo Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500">
                ⚡ Pronto em 30 segundos • 💳 Sem cartão de crédito
              </p>
            </div>

            {/* Social Proof Badge */}
            <div className="pt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>1000+ topos criados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>4.9/5 estrelas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      </section>

      {/* DOBRA 2: BENEFÍCIOS COM MÉTRICAS REAIS */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          {/* Título da seção */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Por Que Escolher Nossa Solução?
            </h2>
            <p className="text-xl text-gray-600">
              Economize tempo e dinheiro com resultados profissionais garantidos
            </p>
          </div>

          {/* Cards de Benefícios */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Benefício 1: Economia de Dinheiro */}
            <Card className="border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Economize até R$140
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Gráficas cobram de <strong>R$50 a R$150</strong> por topo
                  personalizado. Nosso serviço custa apenas{" "}
                  <strong className="text-pink-600">R$9,90</strong> por geração.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Sem taxa de design (R$30-50)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Sem taxa de urgência (R$20-40)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Revisões ilimitadas grátis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefício 2: Economia de Tempo */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Pronto em 30 Segundos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Gráficas levam <strong>3 a 7 dias úteis</strong> para
                  entregar. Você recebe seu topo{" "}
                  <strong className="text-purple-600">instantaneamente</strong>.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Sem espera por briefing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Sem idas e vindas para aprovação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Download imediato após pagamento</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefício 3: Qualidade e Personalização */}
            <Card className="border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Sem Limites de Criatividade
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Esqueça Pinterest e Canva!</strong> Não fique preso a
                  templates que todo mundo usa. Crie designs{" "}
                  <strong className="text-pink-600">
                    verdadeiramente únicos
                  </strong>{" "}
                  com IA avançada.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>14 estilos profissionais</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Qualidade 1024x1024 HD</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Pronto para impressão</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparação Visual */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Gráfica Tradicional vs Nossa IA
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Gráfica Tradicional */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Gráfica Tradicional
                  </h4>
                  <div className="inline-block px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    Método Antigo
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-600">Prazo: 3-7 dias úteis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-600">Preço: R$50-R$150</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-600">
                      Revisões: Cobradas à parte
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-600">Templates limitados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-600">
                      Atendimento em horário comercial
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-2xl font-bold text-gray-900">
                    Total: ~R$100
                  </p>
                  <p className="text-center text-sm text-gray-500 mt-1">
                    + 5 dias de espera
                  </p>
                </div>
              </div>

              {/* Nossa Solução */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-6 border-2 border-pink-300 shadow-xl transform hover:scale-105 transition-transform">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-white mb-2">
                    Nossa IA
                  </h4>
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                    Tecnologia do Futuro
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span className="text-white">Prazo: 30 segundos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span className="text-white">Preço: R$9,90</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span className="text-white">
                      Revisões: Gere quantas quiser
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span className="text-white">
                      Designs únicos ilimitados
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span className="text-white">Disponível 24/7</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-center text-2xl font-bold text-white">
                    Total: R$9,90
                  </p>
                  <p className="text-center text-sm text-white/80 mt-1">
                    Instantâneo
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Highlight */}
            <div className="mt-8 text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <p className="text-lg md:text-xl font-semibold text-gray-900">
                💰 Você economiza{" "}
                <span className="text-green-600 text-2xl">R$90 (90%)</span> e{" "}
                <span className="text-blue-600 text-2xl">7 dias</span> em média
              </p>
            </div>
          </div>

          {/* CTA Secundário */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Começar Agora por R$9,90
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              ✨ Sem mensalidade • 🚀 Resultado instantâneo • 💯 Garantia de
              qualidade
            </p>
          </div>
        </div>
      </section>

      {/* DOBRA 3: EXEMPLOS REAIS DE IMAGENS GERADAS */}
      <section className="px-4 py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="mx-auto max-w-6xl">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Exemplos Reais Criados com Nossa IA
            </h2>
            <p className="text-xl text-gray-600">
              Veja a qualidade e variedade de designs que você pode criar
            </p>
          </div>

          {/* Grid de Exemplos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {/* Exemplo 1 */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-square relative bg-white">
                <Image
                  src="/prompt-examples/parabens-unicornio.png"
                  alt="Topo de bolo com unicórnio e texto Parabéns"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <p className="text-sm font-semibold text-gray-900">
                  Unicórnio Parabéns
                </p>
                <p className="text-xs text-gray-600">Estilo fofo e colorido</p>
              </CardContent>
            </Card>

            {/* Exemplo 2 */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-square relative bg-white">
                <Image
                  src="/prompt-examples/50-anos-elegante.png"
                  alt="Topo de bolo elegante para 50 anos"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4 bg-gradient-to-br from-yellow-50 to-gray-50">
                <p className="text-sm font-semibold text-gray-900">
                  50 Anos Elegante
                </p>
                <p className="text-xs text-gray-600">
                  Estilo sofisticado com dourado
                </p>
              </CardContent>
            </Card>

            {/* Exemplo 3 */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-square relative bg-white">
                <Image
                  src="/prompt-examples/casamento-elegante.png"
                  alt="Topo de bolo de casamento elegante"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4 bg-gradient-to-br from-white to-pink-50">
                <p className="text-sm font-semibold text-gray-900">
                  Casamento Elegante
                </p>
                <p className="text-xs text-gray-600">
                  Romântico com detalhes em ouro
                </p>
              </CardContent>
            </Card>

            {/* Placeholder para mais exemplos */}
            <Card className="overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700">
                    +11 Estilos
                  </p>
                  <p className="text-xs text-gray-500">
                    Disponíveis na plataforma
                  </p>
                </div>
              </div>
            </Card>

            {/* Card de CTA */}
            <Card className="overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 border-0 col-span-2 md:col-span-1">
              <div className="aspect-square flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <Palette className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-bold mb-2">Crie o Seu!</p>
                  <p className="text-xs text-white/80 mb-4">
                    Personalize totalmente
                  </p>
                  <Link href="/">
                    <Button
                      size="sm"
                      className="bg-white text-pink-600 hover:bg-gray-100"
                    >
                      Começar Agora
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Benefícios Visuais */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <Sparkles className="w-10 h-10 text-pink-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Qualidade HD</h4>
              <p className="text-sm text-gray-600">
                1024x1024px prontos para impressão
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <Download className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">
                Download Instantâneo
              </h4>
              <p className="text-sm text-gray-600">
                PNG de alta qualidade após pagamento
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <Palette className="w-10 h-10 text-pink-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">
                14 Estilos Diferentes
              </h4>
              <p className="text-sm text-gray-600">
                De fofo a elegante, para todas ocasiões
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 4: COMO FUNCIONA - PRINTS DA PLATAFORMA */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Simples em 3 Passos
            </h2>
            <p className="text-xl text-gray-600">
              Interface intuitiva, resultado profissional
            </p>
          </div>

          {/* Steps com Mockups */}
          <div className="space-y-16">
            {/* Passo 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200 shadow-xl">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <h4 className="font-bold text-gray-900">
                        Digite ou Escolha um Prompt
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center px-4">
                        <span className="text-gray-500 text-sm">
                          Ex: "Parabéns Maria com unicórnio..."
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-10 bg-pink-100 rounded-lg flex items-center justify-center text-xs font-medium text-pink-700">
                          🦄 Unicórnio
                        </div>
                        <div className="h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xs font-medium text-purple-700">
                          🎂 Elegante
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-2 bg-pink-100 rounded-full text-pink-700 font-semibold mb-4">
                  Passo 1
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Escolha Seu Estilo
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Explore nossa biblioteca com{" "}
                  <strong>14 prompts profissionais</strong> ou crie o seu
                  próprio do zero. Seja criativo!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">
                      Sugestões inteligentes
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">
                      Personalize totalmente
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-semibold mb-4">
                  Passo 2
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  IA Gera Seu Design
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Nossa IA avançada cria um design único em{" "}
                  <strong>alta qualidade</strong>. Aguarde apenas 30 segundos!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Tecnologia OpenAI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">
                      Qualidade profissional garantida
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <h4 className="font-bold text-gray-900">Gerando...</h4>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600">
                          Criando seu topo...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200 shadow-xl">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <h4 className="font-bold text-gray-900">Pague e Baixe</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Seu design está pronto!
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            R$ 9,90
                          </span>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-600"
                          >
                            Pagar com PIX
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-semibold mb-4">
                  Passo 3
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Pague e Baixe
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Pagamento via <strong>PIX instantâneo</strong>. Após
                  confirmação, baixe seu arquivo em alta resolução.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Pagamento 100% seguro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Download imediato</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Experimentar Agora Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Você só paga se gostar do resultado!
            </p>
          </div>
        </div>
      </section>

      {/* DOBRA 5: PROVA SOCIAL + CTA FINAL */}
      <section className="px-4 py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-white">
        <div className="mx-auto max-w-6xl">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Junte-se a Milhares de Clientes Satisfeitos
            </h2>
            <p className="text-xl text-gray-600">
              Confeiteiros, mães, empreendedores e festeiros já estão
              economizando
            </p>
          </div>

          {/* Depoimentos */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Salvou meu evento! Esqueci de encomendar o topo e consegui
                  criar um incrível em 1 minuto. Economizei R$80 e 5 dias!"
                </p>
                <p className="text-sm font-semibold text-gray-900">Ana Paula</p>
                <p className="text-xs text-gray-500">Mãe de 2, São Paulo</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Sou confeiteira e uso para todos os bolos. Meus clientes
                  adoram a personalização e eu economizo horas de trabalho
                  manual!"
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Juliana Costa
                </p>
                <p className="text-xs text-gray-500">
                  Confeiteira, Rio de Janeiro
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Qualidade profissional por 1/10 do preço. Já criei mais de 20
                  topos para festas da família. Vale muito a pena!"
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Carlos Mendes
                </p>
                <p className="text-xs text-gray-500">
                  Empresário, Minas Gerais
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-600 mb-2">1000+</p>
              <p className="text-gray-600">Topos Criados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">4.9/5</p>
              <p className="text-gray-600">Avaliação Média</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">R$90</p>
              <p className="text-gray-600">Economia Média</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">30s</p>
              <p className="text-gray-600">Tempo de Geração</p>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto Para Criar Seu Topo de Bolo Único?
            </h3>
            <p className="text-xl mb-8 text-white/90">
              Comece agora e receba seu design em 30 segundos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-white text-pink-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 font-bold"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Criar Meu Topo Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Download imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Suporte 24/7</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-white/70">
              💳 Aceitamos PIX • 🔒 Pagamento 100% seguro • 📱 Acesso
              instantâneo
            </p>
          </div>

          {/* FAQ Mini */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Ainda tem dúvidas?{" "}
              <Link
                href="/"
                className="text-pink-600 hover:text-pink-700 font-semibold underline"
              >
                Fale com nosso suporte
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Cake Topper Generator. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
