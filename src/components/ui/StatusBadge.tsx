interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success';
  label?: string;
  pulse?: boolean;
}

export default function StatusBadge({ 
  status, 
  label, 
  pulse = false 
}: StatusBadgeProps) {
  const statusConfig = {
    active: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      dot: 'bg-green-500',
      shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
      label: 'Active',
    },
    inactive: {
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/50',
      text: 'text-gray-400',
      dot: 'bg-gray-500',
      shadow: 'shadow-[0_0_10px_rgba(107,114,128,0.3)]',
      label: 'Inactive',
    },
    pending: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500',
      shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]',
      label: 'Pending',
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      dot: 'bg-red-500',
      shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
      label: 'Error',
    },
    success: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      dot: 'bg-blue-500',
      shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
      label: 'Success',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2 
        px-3 py-1.5 
        ${config.bg} ${config.border} ${config.shadow}
        border rounded-full
        backdrop-blur-sm
      `}
    >
      <span className="relative inline-block">
        <span className={`block w-2 h-2 rounded-full ${config.dot}`} />
        {pulse && (
          <span className={`absolute inset-0 w-2 h-2 rounded-full ${config.dot} animate-ping`} />
        )}
      </span>
      <span className={`text-sm font-medium ${config.text}`}>
        {label || config.label}
      </span>
    </span>
  );
}
