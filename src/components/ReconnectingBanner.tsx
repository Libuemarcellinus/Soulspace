interface ReconnectingBannerProps {
  show: boolean;
}

export default function ReconnectingBanner({ show }: ReconnectingBannerProps) {
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/20 border-b border-amber-500/30 py-2 px-4 text-center">
      <span className="text-amber-400 text-sm">Reconnecting…</span>
    </div>
  );
}
