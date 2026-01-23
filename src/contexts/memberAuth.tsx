import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getPortalClient } from "@/integrations/supabase/portalClients";

type MemberAuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  client: ReturnType<typeof getPortalClient>;
};

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(undefined);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getPortalClient("member"), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [client]);

  const signOut = async () => {
    await client.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <MemberAuthContext.Provider value={{ user, session, isLoading, signOut, client }}>
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) throw new Error("useMemberAuth must be used within MemberAuthProvider");
  return ctx;
}
