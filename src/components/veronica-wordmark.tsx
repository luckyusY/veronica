type VeronicaWordmarkProps = {
  className?: string;
  scriptClassName?: string;
  didotClassName?: string;
};

export function VeronicaWordmark({
  className = "",
  scriptClassName = "",
  didotClassName = "",
}: VeronicaWordmarkProps) {
  return (
    <span className={`veronica-wordmark ${className}`.trim()}>
      <span className={`veronica-wordmark-script ${scriptClassName}`.trim()}>
        Veronica
      </span>
      <span className={`veronica-wordmark-didot ${didotClassName}`.trim()}>
        ADANE
      </span>
    </span>
  );
}
