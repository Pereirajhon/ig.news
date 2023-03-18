import Stripe from 'stripe'
import packageInfo from '../../package.json'

export const stripe = new Stripe(
    String(process.env.STRIPE_API_KEY), {
        apiVersion: '2022-11-15',
        appInfo: {
            name: 'Ignews',
            version: packageInfo.version
           
        }

    } 
 )

