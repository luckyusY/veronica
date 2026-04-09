export const officialYouTubePlaylists = [
  {
    title: "Meteriyaye Album",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFP7FOekaLAnobf40NCRdAnw&si=C8upd-PXUMPJXbg8",
    playlistId: "PLj1hYyBldtFP7FOekaLAnobf40NCRdAnw",
    previewVideoId: "xFvqX1WanGM",
    accent: "Album playlist",
    description:
      "The full Meteriyaye album collected in one place, with the complete sequence presented as a dedicated release chapter.",
    note: "Full album sequence / official uploads",
    stat: "13 videos",
  },
  {
    title: "Meteriyaye Album Music Video Clips",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFNWtKPPz20xGULybnTZjAXT&si=H2pQrGYKahV9aH8U",
    playlistId: "PLj1hYyBldtFNWtKPPz20xGULybnTZjAXT",
    previewVideoId: "xFvqX1WanGM",
    accent: "Video clips",
    description:
      "The visual extension of the album era, grouped as a focused video playlist instead of getting lost inside the broader channel feed.",
    note: "Album visuals / official clips",
    stat: "3 videos",
  },
  {
    title: "Veronica Adane Hit Singles (102M Views)",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFN-jNTdW57IeQ898Z2efccd&si=HTiu4REORFYg-RQB",
    playlistId: "PLj1hYyBldtFN-jNTdW57IeQ898Z2efccd",
    previewVideoId: "C-syqgWYs7Q",
    accent: "Hit singles",
    description:
      "The biggest official uploads grouped together for fast listening, replay, and sharing across the strongest public records.",
    note: "Hit singles / official uploads",
    stat: "102M views",
  },
  {
    title: "Veronica Adane Music Video Clips Behind the Scenes",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFPOSCDsVEBxhXTlyhGTl7bD&si=ixkbAbTof-_G9BVI",
    playlistId: "PLj1hYyBldtFPOSCDsVEBxhXTlyhGTl7bD",
    previewVideoId: "IwL3RdaLlM8",
    accent: "Behind the scenes",
    description:
      "A lighter backstage collection that gives the music page range and shows the making-of layer around the official releases.",
    note: "BTS footage / video moments",
    stat: "On-set access",
  },
] as const;

export type OfficialYouTubePlaylist = (typeof officialYouTubePlaylists)[number];

export type PlaylistVideo = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
  views: string;
};

export type PlaylistFeed = {
  feedTitle: string;
  items: PlaylistVideo[];
};

export function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

export async function fetchPlaylistVideos(
  playlistId: string,
  revalidateSeconds = 3600,
): Promise<PlaylistFeed> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      { next: { revalidate: revalidateSeconds } },
    );

    if (!res.ok) {
      return { feedTitle: "", items: [] };
    }

    const xml = await res.text();
    const feedHeader = xml.split("<entry>")[0] ?? "";
    const feedTitle = decodeHtml(feedHeader.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    return {
      feedTitle,
      items: entries
        .map((entry, index) => {
          const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
          const rawTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
          const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
          const thumbnail =
            entry.match(/<media:thumbnail url="(.*?)"/)?.[1] ??
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          const views = entry.match(/<media:statistics views="(.*?)"/)?.[1] ?? "";

          return {
            id,
            title: decodeHtml(rawTitle),
            published,
            thumbnail,
            views,
            url: `https://www.youtube.com/watch?v=${id}&list=${playlistId}&index=${index + 1}`,
          };
        })
        .filter((item) => item.id),
    };
  } catch {
    return { feedTitle: "", items: [] };
  }
}

export function formatPublished(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatViews(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }

  return `${new Intl.NumberFormat("en-US").format(parsed)} views`;
}
