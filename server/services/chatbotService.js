const AILog = require('../models/AILog');
const Product = require('../models/Product');
const Category = require('../models/Category');

class ChatbotService {

  async chatbotResponse(message, history = []) {

    try {

      const startTime = Date.now();

      const lower = message.toLowerCase();

      // =========================
      // PRICE FILTERS
      // =========================

      const underMatch = lower.match(/under\s+(\d+)/);

      if (underMatch) {

        const maxPrice = parseInt(underMatch[1]);

        const products = await Product.find({
          price: { $lte: maxPrice },
          isApproved: true,
          isActive: true
        }).limit(5);

        await AILog.create({
          action: 'chatbot',
          input: message,
          output: {
            message: `Products under Rs ${maxPrice}`,
            count: products.length
          },
          responseTimeMs: Date.now() - startTime
        });

        return {
          message: `Products under Rs ${maxPrice}`,
          products
        };
      }

      const aboveMatch = lower.match(/above\s+(\d+)/);

      if (aboveMatch) {

        const minPrice = parseInt(aboveMatch[1]);

        const products = await Product.find({
          price: { $gte: minPrice },
          isApproved: true,
          isActive: true
        }).limit(5);

        await AILog.create({
          action: 'chatbot',
          input: message,
          output: {
            message: `Premium products above Rs ${minPrice}`,
            count: products.length
          },
          responseTimeMs: Date.now() - startTime
        });

        return {
          message: `Premium products above Rs ${minPrice}`,
          products
        };
      }

      // =========================
      // CATEGORY SEARCH
      // =========================

      if (
        lower.includes('mouse') ||
        lower.includes('gaming mouse')
      ) {

        const products = await Product.find({
          title: { $regex: 'mouse', $options: 'i' },
          isApproved: true,
          isActive: true
        }).limit(5);

        return {
          message: 'Gaming Mouse Products',
          products
        };
      }

      if (
        lower.includes('laptop') ||
        lower.includes('macbook') ||
        lower.includes('notebook')
      ) {

        const products = await Product.find({
          title: { $regex: 'laptop|macbook|notebook', $options: 'i' },
          isApproved: true,
          isActive: true
        }).limit(5);

        return {
          message: 'Laptop Products',
          products
        };
      }

      if (
        lower.includes('mobile') ||
        lower.includes('phone') ||
        lower.includes('smartphone')
      ) {

        const products = await Product.find({
          title: { $regex: 'phone|mobile|smartphone', $options: 'i' },
          isApproved: true,
          isActive: true
        }).limit(5);

        return {
          message: 'Smartphone Products',
          products
        };
      }

      if (
        lower.includes('watch') ||
        lower.includes('smart watch')
      ) {

        const products = await Product.find({
          title: { $regex: 'watch', $options: 'i' },
          isApproved: true,
          isActive: true
        }).limit(5);

        return {
          message: 'Watch Products',
          products
        };
      }

      // =========================
      // CATEGORY TYPES
      // =========================

      if (lower.includes('electronics')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'mouse|laptop|phone|watch|keyboard|camera|monitor|tv',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'electronics',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Electronics Products',
          products
        };
      }

      if (lower.includes('fashion') || lower.includes('clothing')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'shirt|hoodie|jeans|shoes|jacket|clothing',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'fashion|clothing',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Fashion Products',
          products
        };
      }

      if (lower.includes('grocery') || lower.includes('food')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'tea|rice|dry fruit|snacks|grocery',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'food|grocery',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Grocery Products',
          products
        };
      }

      if (lower.includes('fitness') || lower.includes('sports')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'protein|dumbbell|fitness|sports',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'fitness|sports',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Sports & Fitness Products',
          products
        };
      }

      if (lower.includes('beauty')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'beauty|cream|lotion|makeup|perfume',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'beauty',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Beauty Products',
          products
        };
      }

      if (lower.includes('books')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'book|notebook|stationery',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'books|stationery',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Books & Stationery Products',
          products
        };
      }

      if (lower.includes('toys')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'toy|game|lego',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'toys|games',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Toys & Games Products',
          products
        };
      }

      if (lower.includes('automotive') || lower.includes('car')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'car|dash cam|seat cover|automotive',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'automotive',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Automotive Products',
          products
        };
      }

      if (lower.includes('health')) {

        const products = await Product.find({
          isApproved: true,
          isActive: true,
          $or: [
            {
              title: {
                $regex: 'blood pressure|health|medicine|wellness',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: 'health|wellness',
                $options: 'i'
              }
            }
          ]
        }).limit(5);

        return {
          message: 'Health & Wellness Products',
          products
        };
      }

      // =========================
      // GREETINGS
      // =========================

      if (
        lower.includes('hello') ||
        lower.includes('hi') ||
        lower.includes('hey')
      ) {

        return {
          message: 'Hello 👋 How can I help you today?',
          products: []
        };
      }

      if (lower.includes('how are you')) {

        return {
          message: 'I am doing great. How can I assist you?',
          products: []
        };
      }

      // =========================
      // ORDER HELP
      // =========================

      if (lower.includes('track order')) {

        return {
          message: 'You can track your order from the Orders page.',
          products: []
        };
      }

      if (lower.includes('cancel order')) {

        return {
          message: 'You can cancel pending orders from the Order Details page.',
          products: []
        };
      }

      if (lower.includes('refund')) {

        return {
          message: 'Refunds are processed after order cancellation approval.',
          products: []
        };
      }

      // =========================
      // PAYMENT HELP
      // =========================

      if (lower.includes('payment')) {

        return {
          message: 'We support Cash on Delivery and online payments.',
          products: []
        };
      }

      if (lower.includes('cod')) {

        return {
          message: 'Cash on Delivery is available for eligible products.',
          products: []
        };
      }

      // =========================
      // DELIVERY HELP
      // =========================

      if (lower.includes('delivery')) {

        return {
          message: 'Delivery usually takes 3-5 business days.',
          products: []
        };
      }

      if (lower.includes('shipping')) {

        return {
          message: 'Shipping charges depend on your location.',
          products: []
        };
      }

      // =========================
      // ACCOUNT HELP
      // =========================

      if (lower.includes('login')) {

        return {
          message: 'You can login using your email and password.',
          products: []
        };
      }

      if (
        lower.includes('register') ||
        lower.includes('signup')
      ) {

        return {
          message: 'You can create an account from the Register page.',
          products: []
        };
      }

      // =========================
      // DEFAULT RESPONSE
      // =========================

      return {
        message: `I searched for "${message}". Please browse products for more details.`,
        products: []
      };

    } catch (error) {

      console.error('Chatbot error:', error);

      return {
        message: 'Sorry, something went wrong.',
        products: []
      };
    }
  }
}

module.exports = new ChatbotService();