type BoltProps = {
  className?: string;
};

export function Bolt({ className }: BoltProps) {
  return (
    <svg className={className} viewBox="0 0 32 48" aria-hidden="true">
      <path fill="currentColor" d="M20.2 1.2 2.4 26.8h11.4L8.6 46.8 29.8 18.6H17.4L23.6 1.2z" />
    </svg>
  );
}
