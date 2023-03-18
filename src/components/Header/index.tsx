import styles from './styles.module.scss'
import { SignInButton } from './SignInButton'
import Link from 'next/link'
import { ActiveLink } from '../ActiveLink'

export function Header() {

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Ig.news" />
                <nav>
                    <ActiveLink legacyBehavior activeClassName={styles.active} href="/" >
                       <a>Home</a>
                    </ActiveLink>

                    <ActiveLink legacyBehavior activeClassName={styles.active} href="/posts" >
                        <a>Posts</a>
                    </ActiveLink>                 
                </nav>
                <SignInButton/>
            </div>
        </header>
    )
}