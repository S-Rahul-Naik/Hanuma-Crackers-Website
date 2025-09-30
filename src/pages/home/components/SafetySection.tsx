
const safetyTips = [
  {
    icon: 'ri-road-map-line',
    title: 'Light in Open Spaces',
    description: 'Always use fireworks in open areas away from buildings, trees, and vehicles.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: 'ri-drop-line',
    title: 'Keep Water Nearby',
    description: 'Have a bucket of water or garden hose ready for emergencies.',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    icon: 'ri-parent-line',
    title: 'Adult Supervision Required',
    description: 'Children should always be supervised by adults when handling fireworks.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Wear Safety Gear',
    description: 'Use safety glasses and keep a safe distance after lighting crackers.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: 'ri-forbid-line',
    title: 'Never Relight Duds',
    description: 'Never attempt to relight fireworks that have failed to ignite properly.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: 'ri-leaf-line',
    title: 'Choose Eco-Friendly',
    description: 'Opt for green crackers to reduce pollution and protect the environment.',
    color: 'from-emerald-500 to-emerald-600'
  }
];

const emergencyContacts = [
  {
    icon: 'ri-fire-line',
    title: 'Fire Department',
    number: '101',
    color: 'text-yellow-300'
  },
  {
    icon: 'ri-hospital-line',
    title: 'Medical Emergency',
    number: '108',
    color: 'text-green-300'
  },
  {
    icon: 'ri-police-car-line',
    title: 'Police',
    number: '100',
    color: 'text-blue-300'
  }
];

export default function SafetySection() {
  return (
    <section id="safety" className="py-20 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
            <i className="ri-shield-check-line text-2xl text-white"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Safety <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">First</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrate responsibly with our essential safety guidelines. Your safety and the environment matter to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {safetyTips.map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tip.color} rounded-full mb-6`}>
                <i className={`${tip.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <i className="ri-phone-line text-2xl"></i>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Emergency Contacts</h3>
            <p className="text-xl text-white/90 mb-8">In case of any emergency, immediately contact these numbers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <i className={`${contact.icon} text-3xl mb-3 ${contact.color}`}></i>
                  <h4 className="font-bold text-lg mb-2">{contact.title}</h4>
                  <p className="text-2xl font-bold">{contact.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-yellow-100 border border-yellow-300 rounded-full px-6 py-3">
            <i className="ri-lightbulb-line text-yellow-600 mr-2"></i>
            <span className="text-yellow-800 font-semibold">Remember: Celebrate with joy, but safety comes first!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
