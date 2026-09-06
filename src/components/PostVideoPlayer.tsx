'use client';

import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type PostVideoPlayerProps = {
    src: string;
    poster?: string | null;
    className?: string;
};

// Use one native media element: no separate metadata download or duration deadline.
// Loading starts on demand so a feed of large videos does not compete for bandwidth.
function NativeVideo({ src, poster, className = '' }: PostVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    function retry() {
        setError(null);
        const video = videoRef.current;
        if (!video) return;
        video.load();
        void video.play().catch(() => {
            // Native controls remain available if the browser requires another tap.
        });
    }

    return (
        <div className={`relative h-full w-full bg-black ${className}`}>
            <video
                ref={videoRef}
                src={src}
                poster={poster ?? undefined}
                controls
                playsInline
                preload="none"
                aria-label="Post video"
                className="h-full w-full object-contain"
                onError={() => {
                    const code = videoRef.current?.error?.code;
                    setError(code === 3 || code === 4
                        ? 'This video format may not play in your browser.'
                        : 'The video connection was interrupted. Try loading it again.');
                }}
                onPlaying={() => setError(null)}
            />
            {error ? (
                <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-5 text-center text-sm text-white">
                    <p className="max-w-xs">{error}</p>
                    <button type="button" onClick={retry} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                        <RotateCcw size={16} /> Try again
                    </button>
                    <a href={src} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">Open original video</a>
                </div>
            ) : null}
        </div>
    );
}

export default function PostVideoPlayer(props: PostVideoPlayerProps) {
    return <NativeVideo key={props.src} {...props} />;
}
