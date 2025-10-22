import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, MessageSquare, Users, BarChart3, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <Logo />
            </div>
            <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl">
              Seu Mentor de Vendas
              <br />
              <span className="text-primary-foreground/90">Sempre Disponível</span>
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-primary-foreground/90">
              Obtenha orientações personalizadas para suas dúvidas de vendas com nosso assistente virtual inteligente
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Consultas Ilimitadas</h3>
            <p className="text-muted-foreground">
              Faça perguntas sobre vendas e receba orientações personalizadas
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Histórico Completo</h3>
            <p className="text-muted-foreground">
              Acesse todas as suas consultas anteriores a qualquer momento
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Gestão de Equipe</h3>
            <p className="text-muted-foreground">
              Administradores podem gerenciar usuários e definir limites
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Seguro e Confiável</h3>
            <p className="text-muted-foreground">
              Seus dados são protegidos com criptografia de ponta
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-accent to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Pronto para Melhorar suas Vendas?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Junte-se a centenas de profissionais que já confiam no TreinaCorp
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg"
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
