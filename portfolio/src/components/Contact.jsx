import React from "react";

const Contact = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="contact">
      <h2 className="text-4xl font-bold text-center mb-2">Get In Touch</h2>
      <p className="text-center text-lg text-gray-300 mb-12">
        Ready to work together? I'd love to hear about your project and discuss how we can bring your ideas to life.
      </p>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="bg-[#181829] rounded-xl p-6 flex items-center gap-4 shadow">
            <span className="text-3xl text-purple-400">📞</span>
            <div>
              <div className="text-gray-400 text-sm">Phone</div>
              <div className="text-lg font-semibold text-blue-300"><a href="tel:+919542757209">+91 9542757209</a></div>
            </div>
          </div>
          <div className="bg-[#181829] rounded-xl p-6 flex items-center gap-4 shadow">
            <span className="text-3xl text-purple-400">✉️</span>
            <div>
              <div className="text-gray-400 text-sm">Email</div>
              <div className="text-lg font-semibold text-blue-300"><a href="mailto:saiswasthikyadav8@gmail.com">saiswasthikyadav8@gmail.com</a></div>
            </div>
          </div>
          <div className="bg-[#181829] rounded-xl p-6 flex items-center gap-4 shadow">
            <span className="text-3xl text-purple-400">📍</span>
            <div>
              <div className="text-gray-400 text-sm">Location</div>
              <div className="text-lg font-semibold text-blue-300"><a href="https://www.google.com/maps/place/Hyderabad,+Telangana/@17.385044,78.486671,12z/data=!3m1!4b1!4m6!3m5!1s0x3bcb99daa5268a91:0x2b2a395667ee4e0!8m2!3d17.385044!4d78.486671!16s%2Fg%2F11c4022sqw?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D">Hyderabad/Telangana</a></div>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <div className="flex-1 bg-[#181829] rounded-xl p-8 shadow flex flex-col justify-center">
          <form className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-3 rounded-lg bg-[#23234a] text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-3 rounded-lg bg-[#23234a] text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="px-4 py-3 rounded-lg bg-[#23234a] text-white placeholder-gray-400 focus:outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition-transform text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact; 