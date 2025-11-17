import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useCurrency } from '../context/CurrencyContext'
import CurrencySelector from '../components/CurrencySelector'

const BuyCredit = () => {

  const { backendUrl, loadCreditsData, user, token, setShowLogin } = useContext(AppContext)
  const { convertPrice, getCurrencySymbol, selectedCurrency, getCurrencyName, getCurrencyCountry } = useCurrency()

  const navigate = useNavigate()


  const initPay = async (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {

        try {

          const { data } = await axios.post(backendUrl + '/api/user/verify-razor', response, { headers: { token } })
          if (data.success) {
            loadCreditsData()
            navigate('/')
            toast.success('Credit Added')
          }
        } catch (error) {
          toast.error(error.message)
        }

      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  const paymentRazorpay = async (planId) => {
    try {

      if (!user) {
        setShowLogin(true)
      }

      const { data } = await axios.post(backendUrl + '/api/user/pay-razor', { planId, currency: selectedCurrency }, { headers: { token } })
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const paymentStripe = async (planId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/pay-stripe', { planId, currency: selectedCurrency }, { headers: { token } })
      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <motion.div className='min-h-[80vh] text-center pt-14 mb-10'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='flex flex-col items-center mb-8'>
        <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
        <h1 className='text-center text-3xl font-medium mb-4'>Choose the plan</h1>
        {/* Currency selector added here */}
        <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6'>
          <span className='text-sm font-medium text-gray-700'>Select Currency:</span>
          <CurrencySelector />
        </div>
      </div>
      
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500' key={index}>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>{getCurrencySymbol()}{convertPrice(item.price)}</span>/ {item.credits} credits
            </p>
            {/* Display currency information in the plan */}
            <div className='mt-2 text-xs text-gray-500'>
              Currency: {getCurrencyName()} ({selectedCurrency}) - {getCurrencyCountry()}
            </div>
            <div className='flex flex-col mt-4'>
              <button onClick={() => paymentRazorpay(item.id)} className='w-full flex justify-center gap-2 border border-gray-400 mt-2 text-sm rounded-md py-2.5 min-w-52 hover:bg-blue-50 hover:border-blue-400'>
                <img className='h-4' src={assets.razorpay_logo} alt="" />
                <span>Pay with Razorpay</span>
              </button>
              <button onClick={() => paymentStripe(item.id)} className='w-full flex justify-center gap-2 border border-gray-400 mt-2 text-sm rounded-md py-2.5 min-w-52 hover:bg-blue-50 hover:border-blue-400'>
                <img className='h-4' src={assets.stripe_logo} alt="" />
                <span>Pay with Stripe</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit