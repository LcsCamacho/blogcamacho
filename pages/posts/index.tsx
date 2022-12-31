import Head from 'next/head'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import styles from './style.module.scss'
import { useState } from 'react'
import { getPrismicClient } from './../../../blogcamacho/services/prismic';
import Prismic from '@prismicio/client'


import { RichText } from "prismic-dom";

type Post = {
    slug: string;
    title: string;
    cover: string;
    description: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts: postsBlog }: PostsProps) {

    const [posts, setPosts] = useState(postsBlog || [])

    return (
        <>
            <Head>
                <title>Blog Lucas Camacho</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href='/'>
                            <Image src={post.cover}
                                width={720}
                                height={410}
                                quality={100}
                                alt={post.title}
                                priority
                                placeholder='blur'
                                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcS
                                JAAAADUlEQVR42mNUkFeoBwABpgDgVDZbCgAAAABJRU5ErkJggg==' />
                            <strong>{post.title}</strong>
                            <time>{post.updatedAt}</time>
                            <p>{post.description}</p>
                        </Link>
                    ))}

                    <div className={styles.buttonNavigate}>
                        <div>
                            <button>
                                <FiChevronLeft size={25} color='#FFF' />
                            </button>
                            <button>
                                <FiChevronsLeft size={25} color='#FFF' />
                            </button>
                        </div>
                        <div>
                            <button>
                                <FiChevronRight size={25} color='#FFF' />
                            </button>
                            <button>
                                <FiChevronsRight size={25} color='#FFF' />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}


export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        orderings: '[document.last_publication_date desc]',
        fetch: ['post.title', 'post.description', 'post.cover'],
        pageSize: 3
    });

    const posts = response.results.map((post => {

        let dateUp = post.last_publication_date || ''
        let update = new Date(dateUp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find((content: { type: string; }) => content.type === 'paragraph').text ?? '',
            cover: post.data.cover.url || '',
            updatedAt: update
        }
    }))
    return {
        props: {
            posts,
        },
        revalidate: 60 * 30
    }
}