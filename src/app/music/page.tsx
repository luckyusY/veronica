import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Music, Play } from "lucide-react";
import { getCmsPage } from "@/lib/cms-store";
import { listAdminCollection } from "@/lib/admin-store";
import { CmsStandardPage } from "@/components/cms-standard-page";
import type { AdminRecord } from "@/lib/admin-schema";
import type { StandardPageContent } from "@/lib/cms-types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("music");
  return {
    title: page.name,
    description: page.summary,
  };
}

export const revalidate = 60;

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
      } else {
        videoId = parsed.searchParams.get("v");
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

function isLiveRelease(status: string) {
  const s = status.toLowerCase();
  return s === "live" || s === "published" || s === "released";
}

function ReleaseCard({ release }: { release: AdminRecord }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(release.link ?? "");
  // Cloudinary video takes priority; YouTube embed is fallback
  const hasCloudinaryVideo = Boolean(release.videoUrl);
  const hasYouTube = Boolean(youtubeEmbedUrl);
  const hasVideo = hasCloudinaryVideo || hasYouTube;

  return (
    <article className="music-release-card">
      {/* Video embed or cover image */}
      <div className="music-release-media">
        {hasCloudinaryVideo ? (
          <div className="music-release-embed-wrap">
            <video
              className="music-release-embed"
              controls
              playsInline
              poster={release.bannerImage ?? undefined}
              preload="metadata"
              src={release.videoUrl}
              title={release.title}
            />
          </div>
        ) : hasYouTube ? (
          <div className="music-release-embed-wrap">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="music-release-embed"
              loading="lazy"
              src={youtubeEmbedUrl!}
              title={release.title}
            />
          </div>
        ) : release.bannerImage ? (
          <div className="music-release-cover">
            <Image
              alt={release.title}
              className="music-release-cover-img"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              src={release.bannerImage}
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {release.link ? (
              <a
                className="music-release-play-btn"
                href={release.link}
                rel="noreferrer"
                target="_blank"
              >
                <Play fill="currentColor" size={22} />
              </a>
            ) : (
              <div className="music-release-play-icon">
                <Music size={26} />
              </div>
            )}
          </div>
        ) : (
          <div className="music-release-placeholder">
            <Music size={32} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="music-release-body">
        <div className="music-release-meta">
          {release.subtitle ? (
            <span className="music-release-format">{release.subtitle}</span>
          ) : null}
          {release.highlight ? (
            <span className="music-release-views">{release.highlight}</span>
          ) : null}
        </div>

        <h2 className="music-release-title">{release.title}</h2>

        {release.notes ? (
          <p className="music-release-notes">{release.notes}</p>
        ) : null}

        {release.link ? (
          <a
            className="music-release-link"
            href={release.link}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={13} />
            <span>{hasYouTube ? "Open on YouTube" : "Listen / watch"}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default async function MusicPage() {
  const [cmsPage, releases] = await Promise.all([
    getCmsPage("music"),
    listAdminCollection("releases"),
  ]);

  const liveReleases = releases.filter((r) => isLiveRelease(r.status));
  const allReleases = liveReleases.length > 0 ? liveReleases : releases;

  const content = cmsPage.content as StandardPageContent;

  return (
    <main className="music-page">
      {/* CMS-driven hero + editorial sections */}
      <CmsStandardPage content={content} />

      {/* Live releases from admin */}
      {allReleases.length > 0 ? (
        <section className="music-releases-section section-shell">
          <div className="music-releases-header">
            <p className="section-label">Releases</p>
            <h2 className="display-title music-releases-title">
              Music &amp; Videos
            </h2>
            <p className="music-releases-subtitle">
              {liveReleases.length > 0
                ? "Official releases, singles, and video premieres."
                : "Upcoming releases and works in progress."}
            </p>
          </div>
          <div className="music-releases-grid">
            {allReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
