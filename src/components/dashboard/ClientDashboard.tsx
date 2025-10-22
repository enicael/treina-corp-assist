import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ClientDashboardProps {
  userId: string;
  profile: any;
}

const ClientDashboard = ({ userId, profile }: ClientDashboardProps) => {
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState("");
  const [consultas, setConsultas] = useState<any[]>([]);
  const [usageToday, setUsageToday] = useState(0);

  useEffect(() => {
    loadConsultas();
    loadUsageToday();
  }, [userId]);

  const loadConsultas = async () => {
    const { data } = await supabase
      .from('consultas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setConsultas(data);
  };

  const loadUsageToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_usage')
      .select('contagem')
      .eq('user_id', userId)
      .eq('data', today)
      .single();

    setUsageToday(data?.contagem || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pergunta.trim()) {
      toast.error("Digite uma pergunta");
      return;
    }

    const limite = profile?.limite_diario || 5;
    if (limite > 0 && usageToday >= limite) {
      toast.error("Você atingiu o limite diário de consultas. Tente novamente amanhã ou contate o administrador.");
      return;
    }

    setLoading(true);
    setResposta("");

    try {
      const { data, error } = await supabase.functions.invoke('consulta-mentor', {
        body: {
          pergunta,
          telefone: profile?.telefone,
        }
      });

      if (error) throw error;

      setResposta(data.resposta);
      await loadConsultas();
      await loadUsageToday();
      setPergunta("");
      toast.success("Resposta recebida!");
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || "Erro ao consultar o mentor");
    } finally {
      setLoading(false);
    }
  };

  const limite = profile?.limite_diario || 5;
  const consultasRestantes = limite === 0 ? "Ilimitadas" : Math.max(0, limite - usageToday);

  return (
    <div className="space-y-6">
      {/* Card de Limite */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Suas Consultas Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{usageToday}</span>
            <span className="text-muted-foreground">/ {limite === 0 ? "∞" : limite}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {typeof consultasRestantes === 'number' && consultasRestantes === 0
              ? "Limite atingido"
              : `${consultasRestantes} consultas restantes`}
          </p>
        </CardContent>
      </Card>

      {/* Formulário de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Faça sua Pergunta ao Mentor
          </CardTitle>
          <CardDescription>
            Digite sua dúvida de vendas e receba orientações personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Ex: Como lidar com objeções sobre preço?"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className="min-h-[120px]"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>Consultando...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Pergunta
                </>
              )}
            </Button>
          </form>

          {resposta && (
            <Alert className="mt-4 border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="mt-2 text-sm leading-relaxed">
                {resposta}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
          <CardDescription>Suas últimas 10 consultas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma consulta realizada ainda
              </p>
            ) : (
              consultas.map((consulta) => (
                <div key={consulta.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{consulta.pergunta}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(consulta.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{consulta.resposta}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
