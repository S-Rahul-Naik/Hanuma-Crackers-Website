
const companyLinks = [
  { name: 'About Us', href: '#' },
  { name: 'Our Story', href: '#' },
  { name: 'Careers', href: '#' },
  { name: 'Press', href: '#' }
];

const supportLinks = [
  { name: 'Shipping Policy', href: '#' },
  { name: 'Returns & Refunds', href: '#' },
  { name: 'FAQs', href: '#' },
  { name: 'Contact Us', href: '#' }
];

const legalLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cookie Policy', href: '#' },
  { name: 'Disclaimer', href: '#' }
];

const socialLinks = [
  { name: 'Instagram', icon: 'ri-instagram-fill', href: 'https://instagram.com' },
  { name: 'WhatsApp', icon: 'ri-whatsapp-fill', href: 'https://wa.me/8688556898' },
  { name: 'Facebook', icon: 'ri-facebook-fill', href: 'https://facebook.com' },
  { name: 'Twitter', icon: 'ri-twitter-fill', href: 'https://twitter.com' }
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <i className="ri-flashlight-line text-lg text-white"></i>
              </div>
              <h3 className="text-xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>Hanuma Crackers</h3>
            </div>
            <p className="text-purple-200 mb-4 leading-relaxed">
              Bringing joy and celebration to your festivals with premium quality crackers and fireworks. 
              Celebrate responsibly with our eco-friendly options.
            </p>
            <div className="mb-4">
              <p className="text-purple-200 text-sm mb-1">
                <i className="ri-mail-line mr-2"></i>
                hanumacrackers@gmail.com
              </p>
              <p className="text-purple-200 text-sm">
                <i className="ri-phone-line mr-2"></i>
                +91 86885 56898
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-yellow-500 transition-all duration-300 hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-purple-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-purple-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-purple-200 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-fire-line text-yellow-400 animate-pulse"></i>
              </div>
              <p className="text-purple-200">© 2024 Hanuma Crackers. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center space-x-6 text-sm">
              <span className="text-purple-200">Safe & Secure Shopping</span>
              <span className="text-purple-200">•</span>
              <span className="text-purple-200">Eco-Friendly Options</span>
              <span className="text-purple-200">•</span>
              <a 
                href="https://edutech-2k25.netlify.app" 
                className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
              >
                Website Builder
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-20">
        <div className="animate-bounce">
          <i className="ri-fire-line text-2xl text-yellow-400"></i>
        </div>
      </div>
    </footer>
  );
}
