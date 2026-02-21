import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuMail,
  LuMapPin,
  LuPhone,
  LuSend,
  LuGithub,
  LuLinkedin,
  LuTwitter,
  LuCheckCircle
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col md:flex-row overflow-y-auto">
       {/* Left Panel: Info */}
       <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-800 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
               Let's Connect <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}>👋</motion.span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
               I'm always open to new opportunities, collaborations, or just a friendly chat about technology.
            </p>

            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                     <LuMail size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 dark:text-white">Email</h3>
                     <a href={`mailto:${PORTFOLIO_DATA.contact.email}`} className="text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
                        {PORTFOLIO_DATA.contact.email}
                     </a>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                     <LuMapPin size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 dark:text-white">Location</h3>
                     <p className="text-slate-600 dark:text-slate-300">
                        {PORTFOLIO_DATA.contact.location}
                     </p>
                  </div>
               </div>

               {PORTFOLIO_DATA.contact.phone && (
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                       <LuPhone size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 dark:text-white">Phone</h3>
                       <p className="text-slate-600 dark:text-slate-300">
                          {PORTFOLIO_DATA.contact.phone}
                       </p>
                    </div>
                 </div>
               )}

               <div className="flex items-center gap-3 mt-8">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                     {PORTFOLIO_DATA.contact.availability}
                  </span>
               </div>
            </div>

            <div className="flex gap-3 mt-12">
               {PORTFOLIO_DATA.contact.socials.map(social => {
                  const Icon = social.icon === 'github' ? LuGithub :
                               social.icon === 'linkedin' ? LuLinkedin :
                               social.icon === 'twitter' ? LuTwitter :
                               LuMail;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                      title={social.platform}
                    >
                       <Icon size={20} />
                    </a>
                  );
               })}
            </div>
          </motion.div>
       </div>

       {/* Right Panel: Form */}
       <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
             <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                   <input
                     type="text"
                     id="name"
                     name="name"
                     required
                     value={formData.name}
                     onChange={handleChange}
                     className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none dark:text-white dark:border-slate-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                     placeholder=" "
                   />
                   <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                     Your Name
                   </label>
                </div>

                <div className="relative group">
                   <input
                     type="email"
                     id="email"
                     name="email"
                     required
                     value={formData.email}
                     onChange={handleChange}
                     className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none dark:text-white dark:border-slate-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                     placeholder=" "
                   />
                   <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                     Email Address
                   </label>
                </div>

                <div className="relative group">
                   <input
                     type="text"
                     id="subject"
                     name="subject"
                     value={formData.subject}
                     onChange={handleChange}
                     className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none dark:text-white dark:border-slate-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                     placeholder=" "
                   />
                   <label htmlFor="subject" className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                     Subject (Optional)
                   </label>
                </div>

                <div className="relative group">
                   <textarea
                     id="message"
                     name="message"
                     rows={4}
                     required
                     minLength={10}
                     value={formData.message}
                     onChange={handleChange}
                     className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none dark:text-white dark:border-slate-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
                     placeholder=" "
                   />
                   <label htmlFor="message" className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                     Your Message
                   </label>
                   <div className="text-right text-xs text-slate-400 mt-1">
                      {formData.message.length} chars
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`w-full py-3 px-6 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSuccess
                      ? 'bg-green-500 hover:bg-green-600 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : isSuccess ? (
                     <>
                       <LuCheckCircle size={20} /> Message Sent!
                     </>
                   ) : (
                     <>
                       <LuSend size={18} /> Send Message
                     </>
                   )}
                </button>
             </form>
          </motion.div>
       </div>
    </div>
  );
};

export default ContactApp;
