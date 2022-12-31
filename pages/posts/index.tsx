import Head from 'next/head'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import styles from './style.module.scss'
import { useState } from 'react'
import { getPrismicClient } from '../../services/prismic';
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
    page: string;
    totalPage: string;
}

export default function Posts({ posts: postsBlog, page, totalPage }: PostsProps) {
    const [currentPage, setCurrentPage] = useState(Number(page))
    const [posts, setPosts] = useState(postsBlog || [])

    async function reqPost(pageNumber: Number) {
        const prismic = getPrismicClient();

        const response = await prismic.query([
            Prismic.predicates.at('document.type', 'post')
        ], {
            orderings: '[document.last_publication_date desc]',
            fetch: ['post.title', 'post.description', 'post.cover'],
            pageSize: 3,
            page: String(pageNumber)
        });

        return response
    }
    async function navigatePage(pageNumber: Number) {
        const response = await reqPost(pageNumber);

        if(response.results.length === 0) {
            return;
        }

        const getPosts = response.results.map((post => {
            return {
                slug: post.uid || '',
                title: RichText.asText(post.data.title),
                description: post.data.description.find((content: { type: string; }) => content.type === 'paragraph').text ?? '',
                cover: post.data.cover.url || '',
                updatedAt: new Date(post.last_publication_date || '').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        }))
        setCurrentPage(Number(pageNumber))
        setPosts(getPosts)
    }

    return (
        <>
            <Head>
                <title>Blog Lucas Camacho</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
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
                        {Number(currentPage) >= 2 && (
                            <div>
                                <button onClick={() => navigatePage(Number(1))} >
                                    <FiChevronLeft size={25} color='#FFF' />
                                </button>
                                <button onClick={() => navigatePage(Number(currentPage - 1))} >
                                    <FiChevronsLeft size={25} color='#FFF' />
                                </button>
                            </div>
                        )}
                        {Number(currentPage) < Number(totalPage) && (
                            <div>
                                <button onClick={() => navigatePage(Number(currentPage + 1))} >
                                    <FiChevronRight size={25} color='#FFF' />
                                </button>
                                <button onClick={() => navigatePage(Number(totalPage))} >
                                    <FiChevronsRight size={25} color='#FFF' />
                                </button>
                            </div>
                        )}
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

        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find((content: { type: string; }) => content.type === 'paragraph').text ?? '',
            cover: post.data.cover.url || '',
            updatedAt: new Date(post.last_publication_date || '').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    }))
    return {
        props: {
            posts,
            page: response.page,
            totalPage: response.total_pages
        },
        revalidate: 60 * 30
    }
}