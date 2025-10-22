import { MessageSquare } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-lg">
        <MessageSquare className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">TreinaCorp</span>
        <span className="text-xs text-muted-foreground">Assistente de Vendas</span>
      </div>
    </div>
  );
};
