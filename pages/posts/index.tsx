import Head from 'next/head'
import Image from 'next/image'

import styles from './style.module.scss'

import thumb from '../../public/images/webDev.png'
import Link from 'next/link'

import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Posts() {

    return (
        <>
            <Head>
                <title>Blog Lucas Camacho</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <Link href='/'>
                        <Image src={thumb} width={720}
                        height={410}
                        quality={100} alt={'img'} priority/>
                        <strong>Criando meu primeiro app</strong>
                        <time>14 JULHO 2021</time>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum odio, 
                            quaerat dicta excepturi consequatur suscipit </p>
                    </Link>

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