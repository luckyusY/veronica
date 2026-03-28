import { VeronicaWordmark } from "@/components/veronica-wordmark";

export default function Loading() {
  return (
    <main
      aria-label="Loading Veronica Adane official website"
      className="site-preloader"
      role="status"
    >
      <div className="site-preloader-panel">
        <p className="site-preloader-label">Official artist house</p>
        <VeronicaWordmark className="site-preloader-wordmark" />
        <div aria-hidden="true" className="site-preloader-rule" />
        <p className="site-preloader-note">Loading the Veronica Adane experience</p>
      </div>
    </main>
  );
}
