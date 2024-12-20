import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RepoListItem } from '@/types/article';
import { isValidRepoPath, getErrorMessage } from '@/utils/typeGuards';
import ArticleLayout from '@/components/ArticleLayout';
import { useReadmeData } from '@/hooks/useReadmeData';
import { useRepoList } from '@/hooks/useRepoList';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function BlogPost() {
    const router = useRouter();
    const { slug } = router.query;
    const { data: repoList, error: repoError, loading: repoLoading } = useRepoList();
    const [repoInfo, setRepoInfo] = useState<RepoListItem | null>(null);
    const [notFound, setNotFound] = useState(false);

    // Find matching repo when data is available
    useEffect(() => {
        if (slug && repoList?.repos) {
            const decodedSlug = decodeURIComponent(slug as string);
            const repo = repoList.repos.find(r => r.title === decodedSlug);

            if (repo) {
                setRepoInfo(repo);
                setNotFound(false);
            } else {
                setRepoInfo(null);
                setNotFound(true);
            }
        }
    }, [slug, repoList]);

    const repoPath = repoInfo?.repoPath || null;
    const [owner, repo] = isValidRepoPath(repoPath) ? repoPath.split('/') : [null, null];

    // Fetch README data
    const { data, error, loading } = useReadmeData({
        owner,
        repo
    });

    // Redirect to 404 if repo not found
    useEffect(() => {
        if (notFound && !repoLoading) {
            router.push('/404');
        }
    }, [notFound, repoLoading, router]);

    // Show loading state while fetching data
    if (repoLoading || loading) {
        return <Loading />;
    }

    // Handle errors
    if (repoError || error) {
        const errorMessage = getErrorMessage(repoError || error);
        return <ErrorMessage message={errorMessage} />;
    }

    // Return null if no data yet
    if (!data || !repoInfo) {
        return null;
    }

    // Render the article if we have all required data
    return <ArticleLayout data={data} />;
}