import styles from '../post.module.scss'
import { GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updateAt: string
    }
}

export default function PostPreview({post}: PostPreviewProps) { 
    const router = useRouter()
    const {data: session} = useSession()

    useEffect(() => {
        if(session?.user){
            router.push(`/posts/${post.slug}`)
        }
    },[session])

    return(
        <>
            <Head>
                <title> {post.title} </title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1> {post.title} </h1>
                    <time>{post.updateAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{__html: post.content}} 
                     />
                    <div className={styles.continueReading} >
                        Wanna continue reading? 
                        <Link href='/'> 
                            Subscribe now                      
                        </Link>
                    </div>

                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    
    return {
        fallback: 'blocking',
        paths: []
    }
}

export const getStaticProps: GetStaticProps = async({params}) => {
   
    const uid = params?.slug as string

    const prismic = getPrismicClient()

    const response = await prismic.getByUID('posts', uid)

    const post = {
        slug: uid,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content.splice(0, 4)) ,
        updateAt: new Date(response.last_publication_date).toLocaleString('pt-BR',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return{
        props: {post}
    }
}