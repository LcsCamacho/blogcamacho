import { GetServerSideProps } from 'next'
import { getPrismicClient } from './../../services/prismic';
import styles from './post.module.scss'
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Image from 'next/image';

type Post = {
    slug: string;
    title: string;
    cover: string;
    description: string;
    updatedAt: string;
}

interface PostProps {
    post: Post;

}
export default function Post({ post }: PostProps) {
    
    return (
        <>
        <Head>
            <title>{post.title}</title>
        </Head>
        <main className={styles.container}>
            <article className={styles.post}>
                <Image
                src={post.cover}
                width={720}
                height={410}
                alt={post.title}
                priority
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcS
                JAAAADUlEQVR42mNUkFeoBwABpgDgVDZbCgAAAABJRU5ErkJggg=='
                quality={100}/>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
            </article>
        </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }: any) => {
    const { slug } = params;
    const Prismic = getPrismicClient(req)
    const response = await Prismic.getByUID('post', String(slug), {})

    if (!response) {
        return {
            redirect: {
                destination: '/posts',
                permanent: false
            }
        }
    }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(response.last_publication_date || '').toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        props: {
            post
        }
    }
}