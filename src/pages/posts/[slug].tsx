import styles from './post.module.scss'
import { GetServerSideProps, GetStaticPaths } from "next"
import { getSession } from "next-auth/react"
import { getPrismicClient } from "../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

interface PostProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updateAt: string
    }
}

export default function Post({post}: PostProps) { 

    return(
        <>
            <Head>
                <title> {post.title} </title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}}  />
                </article>
            </main>
        </>
    )
}

//export const getStaticPaths: GetStaticPaths = async() => {
//    
 //   return {
 //       fallback: 'blocking',
 //       paths: []
 //   }
//}

export const getServerSideProps: GetServerSideProps = async({req, params}) => {
    const session = await getSession({req})
    const uid = params?.slug as string

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID('posts', uid)

    const post = {
        slug: uid,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content) ,
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