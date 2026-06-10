import mangaData from "@/data/manga.json";
import MangaReader from "./MangaReader";

interface ChapterPageProps {
  params: {
    chapterId: string;
  };
}

export function generateStaticParams() {
  return mangaData.map((ch) => ({
    chapterId: ch.id,
  }));
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapter = mangaData.find((ch) => ch.id === params.chapterId);

  if (!chapter) {
    return (
      <div className="flex flex-grow h-[50vh] items-center justify-center">
        <p className="text-liturgy-stone-gray text-sm">Chapter not found.</p>
      </div>
    );
  }

  return <MangaReader chapter={chapter} />;
}
