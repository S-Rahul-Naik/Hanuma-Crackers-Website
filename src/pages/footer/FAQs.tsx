import { useState } from 'react';
import FooterPageLayout from './FooterPageLayout';

const faqData = [
  {
    category: "Orders & Shopping",
    questions: [
      {
        question: "How do I place an order?",
        answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, net banking, UPI, and cash on delivery for eligible locations."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed."
      },
      {
        question: "Do you offer bulk discounts?",
        answer: "Yes! We offer special pricing for bulk orders above ₹5000. Contact our sales team for custom quotes."
      }
    ]
  },
  {
    category: "Products & Safety",
    questions: [
      {
        question: "Are your products safe to use?",
        answer: "All our products are manufactured by certified companies and meet Bureau of Indian Standards (BIS) safety requirements. Each product comes with detailed safety instructions."
      },
      {
        question: "Do you sell eco-friendly crackers?",
        answer: "Yes! We have a dedicated section for eco-friendly crackers that produce less smoke and noise while maintaining the celebration spirit."
      },
      {
        question: "What's the shelf life of your products?",
        answer: "Our crackers have a shelf life of 2-3 years when stored properly in dry conditions. Always check the manufacturing date on the packaging."
      },
      {
        question: "Can children use these products?",
        answer: "Some products are suitable for children above 8 years under adult supervision. We clearly mark age recommendations on each product."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "Which areas do you deliver to?",
        answer: "We deliver across India to most major cities and towns. Some remote areas may have longer delivery times or additional charges."
      },
      {
        question: "How long does delivery take?",
        answer: "Delivery typically takes 3-7 business days depending on your location. Express delivery is available in select cities."
      },
      {
        question: "What if my order is damaged during shipping?",
        answer: "If you receive damaged products, contact us within 48 hours with photos. We'll arrange for replacement or refund immediately."
      },
      {
        question: "Do you provide tracking information?",
        answer: "Yes! You'll receive tracking details via SMS and email once your order is dispatched."
      }
    ]
  },
  {
    category: "Returns & Support",
    questions: [
      {
        question: "Can I return products if I'm not satisfied?",
        answer: "Due to safety regulations, we only accept returns for damaged, defective, or incorrectly delivered products within 48 hours of delivery."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach us via phone at +91 86885 56898, email at hanumacrackers@gmail.com, or through our contact form on the website."
      },
      {
        question: "What are your customer service hours?",
        answer: "Our customer service is available Monday to Saturday, 9 AM to 7 PM. During festival seasons, we extend our hours."
      },
      {
        question: "Do you provide installation or setup services?",
        answer: "We provide detailed instructions and safety guidelines with each product. For large events, we can recommend local professionals."
      }
    ]
  }
];

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <FooterPageLayout title="Frequently Asked Questions" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-question-answer-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find answers to the most commonly asked questions about our products and services.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {faqData.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-lg">
              <h3 className="text-xl font-bold flex items-center">
                <i className="ri-folder-line mr-2"></i>
                {faqData[activeCategory].category}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {faqData[activeCategory].questions.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      <i className={`ri-arrow-${activeQuestion === index ? 'up' : 'down'}-s-line text-orange-500 transition-transform duration-200`}></i>
                    </button>
                    {activeQuestion === index && (
                      <div className="px-4 pb-4">
                        <div className="bg-orange-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
              <i className="ri-phone-line mr-2"></i>
              Need More Help?
            </h3>
            <p className="text-blue-700 mb-4">
              Can't find what you're looking for? Our customer support team is here to help.
            </p>
            <div className="space-y-2">
              <p className="text-blue-600"><strong>Phone:</strong> +91 86885 56898</p>
              <p className="text-blue-600"><strong>Email:</strong> hanumacrackers@gmail.com</p>
              <p className="text-blue-600"><strong>Hours:</strong> Mon-Sat, 9 AM - 7 PM</p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
              <i className="ri-shield-check-line mr-2"></i>
              Safety First
            </h3>
            <p className="text-green-700 mb-4">
              Always follow safety guidelines when using fireworks and crackers.
            </p>
            <ul className="text-green-600 space-y-1 text-sm">
              <li>• Adult supervision required for children</li>
              <li>• Keep water source nearby</li>
              <li>• Use in open areas only</li>
              <li>• Read instructions carefully</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
          <p className="mb-4">We're here to help make your celebration perfect and safe.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/contact-us" 
              className="inline-block bg-white text-purple-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Us
            </a>
            <a 
              href="/" 
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-300 border border-white"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}