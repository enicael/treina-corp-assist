import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";

const ConfiguracoesTab = () => {
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState({
    url_base: "",
    chave_autenticacao: "",
    timeout_segundos: 30,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data } = await supabase
      .from('api_configurations')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setConfig(data);
      setFormData({
        url_base: data.url_base,
        chave_autenticacao: data.chave_autenticacao || "",
        timeout_segundos: data.timeout_segundos,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (config) {
        const { error } = await supabase
          .from('api_configurations')
          .update(formData)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('api_configurations')
          .insert([formData]);

        if (error) throw error;
      }

      toast.success("Configurações salvas com sucesso!");
      loadConfig();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações da API Externa
          </CardTitle>
          <CardDescription>
            Configure a URL e autenticação da API de consultas ao mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url_base">URL Base da API</Label>
              <Input
                id="url_base"
                type="url"
                placeholder="https://api.exemplo.com"
                value={formData.url_base}
                onChange={(e) => setFormData({ ...formData, url_base: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chave_autenticacao">Chave de Autenticação (opcional)</Label>
              <Input
                id="chave_autenticacao"
                type="password"
                placeholder="Bearer token ou API key"
                value={formData.chave_autenticacao}
                onChange={(e) => setFormData({ ...formData, chave_autenticacao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout_segundos">Timeout da Requisição (segundos)</Label>
              <Input
                id="timeout_segundos"
                type="number"
                min="5"
                max="120"
                value={formData.timeout_segundos}
                onChange={(e) => setFormData({ ...formData, timeout_segundos: parseInt(e.target.value) })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesTab;
