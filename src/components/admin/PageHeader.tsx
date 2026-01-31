import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onExport,
  onAdd,
  addLabel = "Add New",
  onRefresh,
  isRefreshing,
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" onClick={onExport} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {addLabel}
            </Button>
          )}
          {actions}
        </div>
      </div>
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
    </div>
  );
}
