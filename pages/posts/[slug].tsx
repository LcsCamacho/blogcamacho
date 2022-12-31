import { GetServerSideProps } from 'next'
import { getPrismicClient } from './../../services/prismic';
import { RichText } from 'prismic-dom';


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
    console.log(post)
    return (
        <>
            <h1>Post</h1>
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