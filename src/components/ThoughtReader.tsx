'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import LocalizedDateTime from '@/components/LocalizedDateTime';
import PostVideoPlayer from '@/components/PostVideoPlayer';
import QuotedThoughtPreview from '@/components/QuotedThoughtPreview';
import type { RandomThought } from '@/lib/random-thoughts';

export default function ThoughtReader({ thought, showQuotedPreview }: {
    thought: RandomThought;
    showQuotedPreview: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const media = thought.media[activeIndex];

    useEffect(() => {
        if (!open) return;
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // Pause inline playback before presenting the focused player.
        document.querySelectorAll('video').forEach((video) => video.pause());
        dialog?.showModal();
        return () => {
            dialog?.close();
            document.body.style.overflow = previousOverflow;
            triggerRef.current?.focus();
        };
    }, [open]);

    return (
        <>
            <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-200 px-4 text-xs font-semibold text-stone-600 transition hover:border-stone-400 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2">
                Read full screen <ArrowUpRight size={15} />
            </button>
            {open ? createPortal(
                <dialog ref={dialogRef} aria-label="Read full thought" onCancel={() => setOpen(false)} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-stone-50 p-0 text-stone-950 backdrop:bg-black/60">
                    <div className="flex h-full min-h-0 flex-col">
                        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-200 bg-white px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">A thought by Samik</span>
                            <button autoFocus type="button" onClick={() => setOpen(false)} aria-label="Close full thought" className="grid h-11 w-11 place-items-center rounded-full border border-stone-200 hover:bg-stone-100 focus-visible:outline-2"><X size={20} /></button>
                        </header>
                        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid md:overflow-hidden ${media ? 'md:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]' : ''}`}>
                            {media ? (
                                <div className="flex min-h-0 flex-col bg-black p-3 md:p-6">
                                    <div className="h-[42svh] min-h-48 w-full md:h-auto md:min-h-0 md:flex-1">
                                        {media.type === 'video' ? <PostVideoPlayer src={media.url} poster={media.posterUrl} /> : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={media.url} alt={`Thought attachment ${activeIndex + 1}`} className="h-full w-full object-contain" />
                                        )}
                                    </div>
                                    {thought.media.length > 1 ? (
                                        <nav aria-label="Thought attachments" className="flex shrink-0 items-center justify-center gap-5 pt-3 text-white">
                                            <button type="button" aria-label="Previous attachment" onClick={() => setActiveIndex((activeIndex - 1 + thought.media.length) % thought.media.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30"><ChevronLeft size={20} /></button>
                                            <span aria-live="polite" className="text-xs tabular-nums">{activeIndex + 1} / {thought.media.length}</span>
                                            <button type="button" aria-label="Next attachment" onClick={() => setActiveIndex((activeIndex + 1) % thought.media.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30"><ChevronRight size={20} /></button>
                                        </nav>
                                    ) : null}
                                </div>
                            ) : null}
                            <article tabIndex={0} aria-label="Full thought text" className="min-h-0 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:overflow-y-auto md:overscroll-contain md:p-10">
                                <div className="mx-auto max-w-prose">
                                    <p className="mb-6 text-xs text-stone-500"><LocalizedDateTime dateIso={thought.createdAt} timeZone={thought.createdTimeZone} /></p>
                                    <p className="whitespace-pre-wrap text-base leading-8 [overflow-wrap:anywhere]">{thought.content}</p>
                                    {showQuotedPreview && thought.quotedThought ? <div className="mt-6"><QuotedThoughtPreview quote={thought.quotedThought} /></div> : null}
                                </div>
                            </article>
                        </div>
                    </div>
                </dialog>, document.body,
            ) : null}
        </>
    );
}
