import Image from 'next/image';
import ThoughtReader from '@/components/ThoughtReader';
import LocalizedDateTime from '@/components/LocalizedDateTime';
import PostImageViewer from '@/components/PostImageViewer';
import PostMediaCarousel from '@/components/PostMediaCarousel';
import PostVideoPlayer from '@/components/PostVideoPlayer';
import QuotedThoughtPreview from '@/components/QuotedThoughtPreview';
import ShareThoughtButton from '@/components/ShareThoughtButton';
import type { RandomThought } from '@/lib/random-thoughts';

type RandomThoughtCardProps = {
    thought: RandomThought;
    showQuotedPreview?: boolean;
};

export default function RandomThoughtCard({ thought, showQuotedPreview = true }: RandomThoughtCardProps) {
    const wasEdited = thought.updatedAt !== thought.createdAt;

    return (
        <article className="w-full bg-white p-4 sm:p-5">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Image
                        src="/me-here.jpg"
                        alt="Samik"
                        width={42}
                        height={42}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-950">Samik</p>
                        <p className="text-xs text-stone-400">
                            <LocalizedDateTime dateIso={thought.createdAt} timeZone={thought.createdTimeZone} />{wasEdited ? ' · edited' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex max-w-full items-center gap-2">
                    <ThoughtReader thought={thought} showQuotedPreview={showQuotedPreview} />
                    <ShareThoughtButton slug={thought.slug} />
                </div>
            </header>

            {thought.content ? (
                <p className="whitespace-pre-wrap [overflow-wrap:anywhere] text-[15px] leading-7 text-stone-900">{thought.content}</p>
            ) : null}

            {thought.media.length > 0 ? (
                thought.media.length > 1 ? (
                    <div data-post-interactive className="mt-4">
                        <PostMediaCarousel key={thought.media.map((item) => item.id).join(',')} media={thought.media} />
                    </div>
                ) : (
                    <div data-post-interactive className="mt-4 h-[clamp(220px,42vw,380px)] overflow-hidden rounded-2xl bg-transparent">
                        {thought.media[0].type === 'video' ? (
                            <PostVideoPlayer src={thought.media[0].url} poster={thought.media[0].posterUrl} />
                        ) : (
                            <PostImageViewer
                                src={thought.media[0].url}
                                alt="Random thought attachment 1"
                                imageClassName="h-full w-full object-contain"
                            />
                        )}
                    </div>
                )
            ) : null}

            {showQuotedPreview && thought.quotedThought ? (
                <div className="mt-4">
                    <QuotedThoughtPreview quote={thought.quotedThought} />
                </div>
            ) : null}
        </article>
    );
}
