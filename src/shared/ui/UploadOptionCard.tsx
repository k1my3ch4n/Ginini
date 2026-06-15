interface UploadOptionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function UploadOptionCard({ icon, label, onClick }: UploadOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 w-full py-12 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-brand hover:bg-brand-light active:scale-95 transition-all cursor-pointer"
    >
      {icon}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
