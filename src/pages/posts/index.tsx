import styles from './styles.module.scss'
import { getPrismicClient } from "../../services/prismic"
import * as Prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'
import { GetStaticProps } from "next"
import Head from "next/head"
import Link from 'next/link'

interface PostsProps {
    posts: {
        slug: string,
        title: string,
        excerpt : string,
        updateAt: string
    }[]
}

export default function Posts({posts}:PostsProps){
     console.log(posts.map(post => post.updateAt))
    return (
        <>
            <Head>
                <title> Ig.news | Posts</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                {posts && posts.map(post => (
                    <Link href={`posts/${post.slug}`} key={post.slug}>        
                        <div>
                            <time>{post.updateAt}</time>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt}</p>
                        </div>
                        
                    </Link>
                ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic =  getPrismicClient()
    const response = await prismic.getAllByType('posts',{
        fetch: ['data.title', 'data.content'],
        pageSize: 100
    })
 
    const posts = response.map(post => {

        return{
            slug: post.uid,
            title: prismicH.asText(post.data.title),
            excerpt: post.data.content.find((body: any) => body.type ==='paragraph')?.text,
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return{
        props: {
            posts
        }
    }
}