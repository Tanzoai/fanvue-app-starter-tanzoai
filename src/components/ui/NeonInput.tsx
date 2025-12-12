import { InputHTMLAttributes } from 'react';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function NeonInput({
  label,
  error,
  className = '',
  ...props
}: NeonInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 
          bg-gray-900/50 backdrop-blur-sm
          border-2 border-blue-500/30 
          rounded-lg 
          text-white placeholder-gray-400
          focus:outline-none 
          focus:border-blue-500 
          focus:shadow-[0_0_20px_rgba(59,130,246,0.4)]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
