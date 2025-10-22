import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Edit } from "lucide-react";
import { toast } from "sonner";

const UsuariosTab = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    usuario: "",
    senha: "",
    telefone: "",
    limite_diario: 5,
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('nome');

    if (data) setUsuarios(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            telefone: formData.telefone,
            limite_diario: formData.limite_diario,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.senha,
          options: {
            data: {
              nome: formData.nome,
              usuario: formData.usuario,
              telefone: formData.telefone,
              role: 'cliente',
              limite_diario: formData.limite_diario,
            },
          },
        });

        if (authError) throw authError;
        toast.success("Usuário criado com sucesso!");
      }

      setDialogOpen(false);
      setEditingUser(null);
      setFormData({
        nome: "",
        email: "",
        usuario: "",
        senha: "",
        telefone: "",
        limite_diario: 5,
      });
      loadUsuarios();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  const openEditDialog = (usuario: any) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      usuario: usuario.usuario,
      senha: "",
      telefone: usuario.telefone,
      limite_diario: usuario.limite_diario,
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciar Usuários
              </CardTitle>
              <CardDescription>
                Cadastre novos usuários e gerencie limites de consultas
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    nome: "",
                    email: "",
                    usuario: "",
                    senha: "",
                    telefone: "",
                    limite_diario: 5,
                  });
                }}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Editar Usuário" : "Novo Usuário"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "Atualize as informações do usuário"
                      : "Preencha os dados para criar um novo usuário"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="usuario">Usuário</Label>
                        <Input
                          id="usuario"
                          value={formData.usuario}
                          onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senha">Senha</Label>
                        <Input
                          id="senha"
                          type="password"
                          value={formData.senha}
                          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone (55+DDD+Número)</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limite">Limite Diário (0 = ilimitado)</Label>
                    <Input
                      id="limite"
                      type="number"
                      min="0"
                      value={formData.limite_diario}
                      onChange={(e) => setFormData({ ...formData, limite_diario: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingUser ? "Atualizar" : "Criar Usuário"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-center">Limite Diário</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.usuario}</TableCell>
                  <TableCell>{usuario.telefone}</TableCell>
                  <TableCell className="text-center">
                    {usuario.limite_diario === 0 ? "Ilimitado" : usuario.limite_diario}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(usuario)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosTab;
