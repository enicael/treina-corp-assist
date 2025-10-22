import ConsultasTab from "./admin/ConsultasTab";
import RelatoriosTab from "./admin/RelatoriosTab";
import UsuariosTab from "./admin/UsuariosTab";
import ConfiguracoesTab from "./admin/ConfiguracoesTab";

interface AdminDashboardProps {
  activeTab: "consultas" | "historico" | "usuarios" | "config";
  userId: string;
}

const AdminDashboard = ({ activeTab, userId }: AdminDashboardProps) => {
  return (
    <div>
      {activeTab === "consultas" && <ConsultasTab userId={userId} />}
      {activeTab === "historico" && <RelatoriosTab />}
      {activeTab === "usuarios" && <UsuariosTab />}
      {activeTab === "config" && <ConfiguracoesTab />}
    </div>
  );
};

export default AdminDashboard;
