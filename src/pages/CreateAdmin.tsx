import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createAdminUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin');
      
      if (error) throw error;
      
      toast.success("Usuário admin criado com sucesso!");
      toast.success("Email: contato@webcontato.com.br");
      toast.success("Senha: 705j20I4JzBa");
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message || "Erro ao criar admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Usuário Administrador</CardTitle>
          <CardDescription>
            Clique no botão abaixo para criar o usuário admin inicial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createAdminUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Criando..." : "Criar Admin"}
          </Button>
          
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Credenciais que serão criadas:</p>
            <p>Email: contato@webcontato.com.br</p>
            <p>Usuário: administrador</p>
            <p>Senha: 705j20I4JzBa</p>
            <p>Telefone: 5511985840220</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;
