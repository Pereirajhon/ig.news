import styles from './styles.module.scss'
import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface SubscribeButtonProps {
  priceId: string
}

export const SubscribeButton = ({priceId}: SubscribeButtonProps) => {
  const {data: session} = useSession()

  async function handleSubscribe(){
    if(!session){
      signIn('github')
      return;
    }
    try {
      const response = await api.post('/subscribe')
      const {sessionId} = response.data

      const stripeJs = await getStripeJs()
      await stripeJs?.redirectToCheckout({sessionId})

    } catch(error) {
      console.error(error)
    }
  }
  
  return (
      <button type='button'
       className={styles.subscribeButton}
       onClick={handleSubscribe}
      >
        Subscribe Now
      </button>
  )
}
