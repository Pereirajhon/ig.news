import * as Prismic from '@prismicio/client'

export const getPrismicClient = () => {
    //const endpoint = Prismic.getRepositoryEndpoint('ignitenews1234')
    const client = Prismic.createClient(process.env.PRISMIC_API_ENDPOINT!,{
        accessToken: process.env.PRISMIC_ACESS_TOKEN as string,
    })//.enableAutoPreviewsFromReq(req)

    return client
}
