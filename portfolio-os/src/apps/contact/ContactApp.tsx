import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuMail,
  LuMapPin,
  LuPhone,
  LuGithub,
  LuLinkedin,
  LuTwitter,
  LuSend,
  LuCheck,
  LuUser,
  LuMessageSquare,
  LuType,
  LuLoader,
  LuExternalLink
} from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../../config/portfolio-data';

interface ContactAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const ContactApp: React.FC<ContactAppProps> = ({ mode }) => {
  const { contact } = PORTFOLIO_DATA;
  const isMobile = mode === 'mobile';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const messageError = validateField('message', formData.message);

    if (nameError || emailError || messageError) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return LuGithub;
      case 'linkedin': return LuLinkedin;
      case 'twitter': return LuTwitter;
      default: return LuExternalLink;
    }
  };

  return (
    <div className={`h-full w-full overflow-y-auto bg-gray-50 text-gray-900 ${isMobile ? 'p-4' : 'p-0'}`}>
      <div className={`mx-auto h-full flex ${isMobile ? 'flex-col gap-8' : 'flex-row'}`}>

        {/* Left Panel - Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${isMobile ? 'w-full' : 'w-1/2 p-12'} bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center relative overflow-hidden`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 30, 0],
                rotate: [0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 space-y-8">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-block mb-4 p-3 bg-blue-100 rounded-2xl text-2xl"
              >
                👋
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Let's Connect</h1>
              <p className="text-lg text-gray-600">
                I'm always open to new opportunities and collaborations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <LuMail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Email</div>
                  <a href={`mailto:${contact.email}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <LuMapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Location</div>
                  <div className="text-gray-900 font-medium">{contact.location}</div>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <LuPhone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">Phone</div>
                    <div className="text-gray-900 font-medium">{contact.phone}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Available for opportunities
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200/50">
              <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Follow Me</h3>
              <div className="flex gap-4">
                {contact.socials.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white rounded-xl text-gray-600 hover:text-blue-600 shadow-sm hover:shadow-md transition-all border border-gray-100"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${isMobile ? 'w-full pb-20' : 'w-1/2 p-12'} bg-white flex flex-col justify-center`}
        >
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <div className="relative group">
                  <LuUser className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Name"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'} rounded-xl focus:ring-4 transition-all outline-none`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <LuMail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Email"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'} rounded-xl focus:ring-4 transition-all outline-none`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <LuType className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject (Optional)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <LuMessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Message..."
                    rows={4}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'} rounded-xl focus:ring-4 transition-all outline-none resize-none`}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {formData.message.length} chars
                  </div>
                </div>
                {errors.message && <p className="text-xs text-red-500 ml-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isSuccess
                    ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <LuLoader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <LuCheck className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <LuSend className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4"
                  >
                    <div className="flex gap-3">
                      <div className="bg-green-100 p-2 rounded-full h-fit">
                        <LuCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900">Simulation Successful</h4>
                        <p className="text-sm text-green-700 mt-1">
                          This is a demo. In production, this would send an email to {contact.email}.
                        </p>
                        <a href={`mailto:${contact.email}`} className="text-sm font-medium text-green-800 underline mt-2 inline-block">
                          Open in Mail App
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactApp;
