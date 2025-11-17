import userModel from "../models/userModel.js"
import transactionModel from "../models/transactionModel.js"
import razorpay from 'razorpay';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import stripe from "stripe";

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token, user: { name: user.name } })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token, user: { name: user.name } })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to get user available credits data
const userCredits = async (req, res) => {
    try {

        const { userId } = req.body

        // Fetching userdata using userId
        const user = await userModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// razorpay gateway initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Payment API to add credits
const paymentRazorpay = async (req, res) => {
    try {

        const { userId, planId, currency = process.env.CURRENCY || 'INR' } = req.body

        const userData = await userModel.findById(userId)

        // checking for planId and userdata
        if (!userData || !planId) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        let credits, plan, amount, date

        // Switch Cases for different plans
        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({ success: false, message: 'plan not found' })
        }

        // Adjust amount based on currency
        const currencyRates = {
            'INR': 1,
            'USD': 0.012,
            'EUR': 0.011,
            'GBP': 0.0095,
            'AUD': 0.018,
            'CAD': 0.016,
            'SGD': 0.016,
            'JPY': 1.77,
            'CNY': 0.088,
            'KRW': 16.7,
            'HKD': 0.094,
            'NZD': 0.019,
            'CHF': 0.011,
            'SEK': 0.13,
            'NOK': 0.13,
            'MXN': 0.21,
            'BRL': 0.067,
            'ARS': 11.2,
            'CLP': 11.8,
            'PEN': 0.045,
            'COP': 47.5,
            'UYU': 0.47,
            'ZAR': 0.23,
            'AED': 0.044,
            'SAR': 0.045,
            'QAR': 0.044,
            'KWD': 0.0036,
            'BHD': 0.0045,
            'OMR': 0.0046,
            'JOD': 0.0085,
            'EGP': 0.37,
            'TRY': 0.40,
            'RUB': 1.12,
            'PLN': 0.048,
            'CZK': 0.28,
            'HUF': 4.4,
            'ILS': 0.045,
            'DKK': 0.083,
            'THB': 0.43,
            'IDR': 194,
            'MYR': 0.055,
            'PHP': 0.68,
            'VND': 295,
            'BDT': 1.32,
            'PKR': 3.3,
            'LKR': 3.6,
            'NPR': 1.6,
            'MMK': 25.0,
            'KES': 1.6,
            'NGN': 18.0,
            'GHS': 0.14,
            'TZS': 30.0,
            'UGX': 45.0,
            'RWF': 15.0,
            'MAD': 0.12,
            'TND': 0.037,
            'DZD': 1.6,
            'XOF': 7.2,
            'CDF': 32.0,
            'BWP': 0.16,
            'ZMW': 0.33,
            'AOA': 1.0,
            'MZN': 0.77,
            'ETB': 0.68,
            'GMD': 0.78,
            'MWK': 13.0,
            'BIF': 34.0,
            'SLL': 300,
            'DJF': 2.1,
            'SOS': 6.7,
            'XAF': 7.2,
            'KMF': 5.4,
            'SCR': 0.16,
            'MUR': 0.54,
            'MGA': 54.0,
            'CVE': 1.2,
            'STN': 0.27,
            'ERN': 0.18,
            'SVC': 1.05,
            'HNL': 0.29,
            'NIO': 0.44,
            'CRC': 6.2,
            'PAB': 0.012,
            'GTQ': 0.092,
            'CUP': 0.29,
            'DOP': 0.67,
            'JMD': 1.8,
            'TTD': 0.082,
            'BBD': 0.024,
            'BZD': 0.024,
            'BSD': 0.012,
            'FJD': 0.027,
            'PGK': 0.044,
            'WST': 0.033,
            'TOP': 0.028,
            'VUV': 1.4,
            'KHR': 49.0,
            'LAK': 250,
            'MNT': 42.0,
            'KZT': 5.5,
            'UZS': 150,
            'TJS': 0.13,
            'AFN': 0.84,
            'AMD': 4.6,
            'AZN': 0.021,
            'BYN': 0.031,
            'BGN': 0.022,
            'GEL': 0.032,
            'MDL': 0.22,
            'RON': 0.054,
            'UAH': 0.46,
            'BAM': 0.022,
            'MKD': 0.67,
            'RSD': 1.3,
            'HRK': 0.085,
            'ALL': 1.2,
            'ISK': 1.6,
            'BND': 0.016,
            'FKP': 0.010,
            'GIP': 0.010,
            'GGP': 0.010,
            'JEP': 0.010,
            'IMP': 0.010,
            'SYP': 300,
            'LBP': 1800,
            'IQD': 15,
            'IRR': 500,
            'YER': 3,
            'MRO': 0.43,
            'MVR': 0.18,
            'BTN': 1.0,
            'NAD': 0.23,
            'SZL': 0.23,
            'LSL': 0.23,
            'LRD': 2.2,
            'GNF': 100,
            'XPF': 1.3,
            'XCD': 0.032,
            'ANG': 0.022,
            'AWG': 0.022,
            'KYD': 0.010,
            'BMD': 0.012,
            'SBD': 0.10,
            'TVD': 0.018,
            'SH': 0.010,
            'LYD': 0.058,
            'SDG': 6.8,
            'SSP': 18,
            'MRU': 0.43
        };

        const rate = currencyRates[currency] || currencyRates['INR'];
        amount = Math.round(amount / currencyRates['INR'] * rate);

        date = Date.now()

        // Creating Transaction Data
        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        }

        // Saving Transaction Data to Database
        const newTransaction = await transactionModel.create(transactionData)

        // Creating options to create razorpay Order
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: newTransaction._id,
        }

        // Creating razorpay Order
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id } = req.body;

        // Fetching order data from razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Checking for payment status
        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' })
            }

            // Adding Credits in user data
            const userData = await userModel.findById(transactionData.userId)
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            // Marking the payment true 
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: "Credits Added" });
        }
        else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

// Payment API to add credits ( Stripe )
const paymentStripe = async (req, res) => {
    try {

        const { userId, planId, currency = process.env.CURRENCY || 'INR' } = req.body
        const { origin } = req.headers

        const userData = await userModel.findById(userId)

        // checking for planId and userdata
        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        let credits, plan, amount, date

        // Switch Cases for different plans
        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({ success: false, message: 'plan not found' })
        }

        // Adjust amount based on currency
        const currencyRates = {
            'INR': 1,
            'USD': 0.012,
            'EUR': 0.011,
            'GBP': 0.0095,
            'AUD': 0.018,
            'CAD': 0.016,
            'SGD': 0.016,
            'JPY': 1.77,
            'CNY': 0.088,
            'KRW': 16.7,
            'HKD': 0.094,
            'NZD': 0.019,
            'CHF': 0.011,
            'SEK': 0.13,
            'NOK': 0.13,
            'MXN': 0.21,
            'BRL': 0.067,
            'ARS': 11.2,
            'CLP': 11.8,
            'PEN': 0.045,
            'COP': 47.5,
            'UYU': 0.47,
            'ZAR': 0.23,
            'AED': 0.044,
            'SAR': 0.045,
            'QAR': 0.044,
            'KWD': 0.0036,
            'BHD': 0.0045,
            'OMR': 0.0046,
            'JOD': 0.0085,
            'EGP': 0.37,
            'TRY': 0.40,
            'RUB': 1.12,
            'PLN': 0.048,
            'CZK': 0.28,
            'HUF': 4.4,
            'ILS': 0.045,
            'DKK': 0.083,
            'THB': 0.43,
            'IDR': 194,
            'MYR': 0.055,
            'PHP': 0.68,
            'VND': 295,
            'BDT': 1.32,
            'PKR': 3.3,
            'LKR': 3.6,
            'NPR': 1.6,
            'MMK': 25.0,
            'KES': 1.6,
            'NGN': 18.0,
            'GHS': 0.14,
            'TZS': 30.0,
            'UGX': 45.0,
            'RWF': 15.0,
            'MAD': 0.12,
            'TND': 0.037,
            'DZD': 1.6,
            'XOF': 7.2,
            'CDF': 32.0,
            'BWP': 0.16,
            'ZMW': 0.33,
            'AOA': 1.0,
            'MZN': 0.77,
            'ETB': 0.68,
            'GMD': 0.78,
            'MWK': 13.0,
            'BIF': 34.0,
            'SLL': 300,
            'DJF': 2.1,
            'SOS': 6.7,
            'XAF': 7.2,
            'KMF': 5.4,
            'SCR': 0.16,
            'MUR': 0.54,
            'MGA': 54.0,
            'CVE': 1.2,
            'STN': 0.27,
            'ERN': 0.18,
            'SVC': 1.05,
            'HNL': 0.29,
            'NIO': 0.44,
            'CRC': 6.2,
            'PAB': 0.012,
            'GTQ': 0.092,
            'CUP': 0.29,
            'DOP': 0.67,
            'JMD': 1.8,
            'TTD': 0.082,
            'BBD': 0.024,
            'BZD': 0.024,
            'BSD': 0.012,
            'FJD': 0.027,
            'PGK': 0.044,
            'WST': 0.033,
            'TOP': 0.028,
            'VUV': 1.4,
            'KHR': 49.0,
            'LAK': 250,
            'MNT': 42.0,
            'KZT': 5.5,
            'UZS': 150,
            'TJS': 0.13,
            'AFN': 0.84,
            'AMD': 4.6,
            'AZN': 0.021,
            'BYN': 0.031,
            'BGN': 0.022,
            'GEL': 0.032,
            'MDL': 0.22,
            'RON': 0.054,
            'UAH': 0.46,
            'BAM': 0.022,
            'MKD': 0.67,
            'RSD': 1.3,
            'HRK': 0.085,
            'ALL': 1.2,
            'ISK': 1.6,
            'BND': 0.016,
            'FKP': 0.010,
            'GIP': 0.010,
            'GGP': 0.010,
            'JEP': 0.010,
            'IMP': 0.010,
            'SYP': 300,
            'LBP': 1800,
            'IQD': 15,
            'IRR': 500,
            'YER': 3,
            'MRO': 0.43,
            'MVR': 0.18,
            'BTN': 1.0,
            'NAD': 0.23,
            'SZL': 0.23,
            'LSL': 0.23,
            'LRD': 2.2,
            'GNF': 100,
            'XPF': 1.3,
            'XCD': 0.032,
            'ANG': 0.022,
            'AWG': 0.022,
            'KYD': 0.010,
            'BMD': 0.012,
            'SBD': 0.10,
            'TVD': 0.018,
            'SH': 0.010,
            'LYD': 0.058,
            'SDG': 6.8,
            'SSP': 18,
            'MRU': 0.43
        };

        const rate = currencyRates[currency] || currencyRates['INR'];
        amount = Math.round(amount / currencyRates['INR'] * rate);

        date = Date.now()

        // Creating Transaction Data
        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        }

        // Saving Transaction Data to Database
        const newTransaction = await transactionModel.create(transactionData)

        const stripeCurrency = currency.toLocaleLowerCase()

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency: stripeCurrency,
                product_data: {
                    name: "Credit Purchase"
                },
                unit_amount: transactionData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&transactionId=${newTransaction._id}`,
            cancel_url: `${origin}/verify?success=false&transactionId=${newTransaction._id}`,
            line_items: line_items,
            mode: 'payment',
        })
        
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to verify stripe payment
const verifyStripe = async (req, res) => {
    try {

        const { transactionId, success } = req.body

        // Checking for payment status
        if (success === 'true') {
            const transactionData = await transactionModel.findById(transactionId)
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Already Verified' })
            }

            // Adding Credits in user data
            const userData = await userModel.findById(transactionData.userId)
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            // Marking the payment true 
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: "Credits Added" });
        }
        else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe }