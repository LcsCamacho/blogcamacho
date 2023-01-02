import { GetStaticProps } from "next";

import Head from 'next/head';
import styles from './style.module.scss';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { FaYoutube, FaInstagram, FaLinkedin, FaFacebook} from 'react-icons/fa';
import Link from "next/link";

type Content = {
  title: string;
  description: string;
  banner: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

interface ContentProps{
  content: Content
}

export default function Sobre({ content }: ContentProps){
  return(
    <>
      <Head>
        <title>Quem somos?</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <Link href={content.youtube}>
              <FaYoutube size={40} />
            </Link>

            <Link href={content.instagram}>
              <FaInstagram size={40} />
            </Link>

            <Link href={content.facebook}>
              <FaFacebook size={40} />
            </Link>

            <Link href={content.linkedin}>
              <FaLinkedin size={40} />
            </Link>
          </section>

          <img
            src={content.banner}
            alt="Sobre Lucas Camacho"
          />

        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'sobre')
  ])

  const {
    title,
    description,
    banner,
    facebook,
    instagram,
    youtube,
    linkedin
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url
  };

  return{
    props:{
      content
    },
    revalidate: 60 * 60
  }
}