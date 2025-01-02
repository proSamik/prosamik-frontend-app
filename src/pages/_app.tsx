// pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import MainLayout from '@/components/MainLayout'
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    const { trackPageView } = usePageAnalytics();
    const router = useRouter();

    useEffect(() => {
        // Track page views whenever the route changes
        const handleRouteChange = (url: string) => {
            const pageName = url.split('/')[1] || 'home';
            void trackPageView(pageName);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events, trackPageView]);

    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}