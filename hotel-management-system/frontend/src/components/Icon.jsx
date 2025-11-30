import React from 'react';
import {
  Users,
  Bed,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Crown,
  Star,
  Plus,
  Save,
  XCircle
} from 'lucide-react';

/**
 * Componente wrapper para ícones do Lucide React
 * Fornece padronização e facilita manutenção
 */

// Mapeamento de nomes para componentes de ícones
const iconMap = {
  users: Users,
  bed: Bed,
  checkCircle: CheckCircle,
  calendar: Calendar,
  clock: Clock,
  sparkles: Sparkles,
  edit: Edit,
  trash: Trash2,
  cancel: X,
  alert: AlertTriangle,
  crown: Crown,
  star: Star,
  plus: Plus,
  save: Save,
  xCircle: XCircle,
};

const Icon = ({ 
  name, 
  size = 20, 
  color, 
  className = '',
  strokeWidth = 2,
  ...props 
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

// Exportações nomeadas para uso direto
export {
  Users,
  Bed,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Crown,
  Star,
  Plus,
  Save,
  XCircle
};

export default Icon;