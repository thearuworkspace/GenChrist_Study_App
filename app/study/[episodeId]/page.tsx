import episodesData from "@/data/episodes.json";
import EpisodeReader from "./EpisodeReader";

interface EpisodePageProps {
  params: {
    episodeId: string;
  };
}

export function generateStaticParams() {
  return episodesData.map((ep) => ({
    episodeId: ep.id,
  }));
}

export default function EpisodePage({ params }: EpisodePageProps) {
  const episode = episodesData.find((ep) => ep.id === params.episodeId);

  if (!episode) {
    return (
      <div className="flex flex-grow h-[50vh] items-center justify-center">
        <p className="text-liturgy-stone-gray text-sm">Episode not found.</p>
      </div>
    );
  }

  return <EpisodeReader episode={episode as any} />;

}
