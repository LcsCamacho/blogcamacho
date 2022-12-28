import React from "react";
import styles from './styles.module.scss'
import Image from 'next/image'
import logo from '../../public/images/logo.svg'
import Link from 'next/link'

import { ActiveLink } from '../ActiveLink'

export function Header() {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <ActiveLink href='/' activeClassName={styles.active}>
                    <Image src={logo} alt="Logo" />
                </ActiveLink>

                <nav>
                    <ActiveLink href='/' activeClassName={styles.active}>
                        <span>Home</span>
                    </ActiveLink>
                    <ActiveLink href='/' activeClassName={styles.active}>
                        <span>Conteúdos</span>
                    </ActiveLink>
                    <ActiveLink href='/' activeClassName={styles.active}>
                        <span>Quem somos?</span>
                    </ActiveLink>
                </nav>

                <Link className={styles.readyButton} type="button" href="/">COMEÇAR</Link>
            </div>
        </header>
    )
}