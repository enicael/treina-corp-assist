import ClientDashboard from "../ClientDashboard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConsultasTabProps {
  userId: string;
}

const ConsultasTab = ({ userId }: ConsultasTabProps) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) setProfile(data);
  };

  return <ClientDashboard userId={userId} profile={profile} />;
};

export default ConsultasTab;
