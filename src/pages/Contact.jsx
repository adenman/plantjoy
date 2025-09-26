import React from 'react';

// --- SVG Icons for Contact Cards ---
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={2}></rect>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2}></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round"></line>
    </svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

// --- Hero Section ---
const ContactHero = () => (
    <section 
      className="relative bg-cover bg-center h-[50vh] text-white flex items-center justify-center" 
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2940&auto=format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          Get In Touch
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          We'd love to hear from you! Reach out with questions, comments, or catering inquiries.
        </p>
      </div>
    </section>
);

// --- Main Contact Page ---
const Contact = () => {
    const contactMethods = [
        { icon: <InstagramIcon />, title: "Instagram", info: "@plantjoymke", link: "https://www.instagram.com/plantjoymke", cta: "Follow Us" },
        { icon: <FacebookIcon />, title: "Facebook", info: "Plant Joy", link: "#", cta: "Like Our Page" }, // Add your Facebook link
        { icon: <MailIcon />, title: "Email", info: "PlantJoyMKE@gmail.com", link: "mailto:PlantJoyMKE@gmail.com", cta: "Send an Email" },
        { icon: <PhoneIcon />, title: "Phone", info: "414-301-7785", link: "tel:4143017785", cta: "Text or Call" }
    ];

    return (
        <>
            <ContactHero />
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-16">
                        <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                            Use this website as a resource for plant-based food and health info. We love plants and sharing about the benefits of a high-fiber, plant-heavy lifestyle.
                        </p>
                         <p className="mt-4 text-sm text-gray-500 italic">
                            *Please remember Plant Joy does not replace your doctor or medical team; we are simply sharing information.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactMethods.map((method, index) => (
                            <a 
                                key={index} 
                                href={method.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300"
                            >
                                {method.icon}
                                <h3 className="text-2xl font-bold text-brand-gray mt-4">{method.title}</h3>
                                <p className="text-brand-gray my-2">{method.info}</p>
                                <span className="mt-auto font-bold text-white bg-brand-green py-2 px-6 rounded-full transition-colors">
                                    {method.cta}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;