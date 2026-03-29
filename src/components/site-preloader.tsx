import { VeronicaWordmark } from "@/components/veronica-wordmark";

export function SitePreloader() {
  return (
    <main
      aria-label="Loading Veronica Adane official website"
      className="site-preloader"
      role="status"
    >
      <div className="site-preloader-panel">
        <VeronicaWordmark className="site-preloader-wordmark" />
        <p className="site-preloader-loading">Loading</p>
      </div>
    </main>
  );
}
