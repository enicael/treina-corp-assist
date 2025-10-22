import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";

const RelatoriosTab = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    loadUsuariosComUsage();
  }, []);

  const loadUsuariosComUsage = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('nome');

    if (profiles) {
      const usuariosComUsage = await Promise.all(
        profiles.map(async (profile) => {
          const { data: usage } = await supabase
            .from('daily_usage')
            .select('contagem')
            .eq('user_id', profile.id)
            .eq('data', today)
            .single();

          return {
            ...profile,
            usageToday: usage?.contagem || 0,
          };
        })
      );

      setUsuarios(usuariosComUsage);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Uso Diário de Consultas
          </CardTitle>
          <CardDescription>
            Visualize quantas consultas cada usuário realizou hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-center">Consultas Hoje</TableHead>
                <TableHead className="text-center">Limite Diário</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => {
                const limite = usuario.limite_diario;
                const usado = usuario.usageToday;
                const percentual = limite === 0 ? 0 : (usado / limite) * 100;
                
                return (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.usuario}</TableCell>
                    <TableCell>{usuario.telefone}</TableCell>
                    <TableCell className="text-center">{usado}</TableCell>
                    <TableCell className="text-center">
                      {limite === 0 ? "Ilimitado" : limite}
                    </TableCell>
                    <TableCell className="text-center">
                      {limite === 0 ? (
                        <span className="text-green-600 text-sm">Ilimitado</span>
                      ) : usado >= limite ? (
                        <span className="text-red-600 text-sm font-medium">Limite Atingido</span>
                      ) : percentual >= 80 ? (
                        <span className="text-orange-600 text-sm">Próximo do Limite</span>
                      ) : (
                        <span className="text-green-600 text-sm">Disponível</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosTab;
