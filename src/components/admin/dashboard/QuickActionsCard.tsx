import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface QuickAction {
  title: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              target={action.title === "View Site" ? "_blank" : undefined}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all text-center"
            >
              <div className={`p-2 rounded-lg ${action.bg} group-hover:scale-110 transition-transform mb-1.5`}>
                <action.icon className={`w-4 h-4 ${action.color}`} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                {action.title}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
