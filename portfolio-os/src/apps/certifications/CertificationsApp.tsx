import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuAward,
  LuExternalLink,
  LuCalendar,
  LuCheck,
  LuSearch,
} from 'react-icons/lu';
import {
  SiAmazon,
  SiGoogle,
  SiCoursera,
  SiUdemy,
  SiLinuxfoundation,
  SiOracle,
  SiCisco,
  SiMeta,
} from 'react-icons/si';
import { PORTFOLIO_DATA, type Certification } from '../../config/portfolio-data';

// --- Icon Mapping ---
const getIssuerIcon = (issuer: string) => {
  const normalized = issuer.toLowerCase().replace(/\s+/g, '');
  if (normalized.includes('aws') || normalized.includes('amazon')) return SiAmazon;
  if (normalized.includes('google')) return SiGoogle;
  if (normalized.includes('coursera')) return SiCoursera;
  if (normalized.includes('udemy')) return SiUdemy;
  if (normalized.includes('cncf') || normalized.includes('linux')) return SiLinuxfoundation;
  if (normalized.includes('oracle')) return SiOracle;
  if (normalized.includes('cisco')) return SiCisco;
  if (normalized.includes('meta') || normalized.includes('facebook')) return SiMeta;
  return LuAward;
};

interface CertificationsAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const CertificationCard = ({ cert, index }: { cert: Certification; index: number }) => {
  const IssuerIcon = getIssuerIcon(cert.issuer);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 50,
        damping: 10,
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl"
    >
      {/* Decorative Ribbon/Background */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-2xl transition-all group-hover:scale-150 group-hover:from-blue-500/10 group-hover:to-purple-500/10" />

      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 p-3 shadow-inner ring-1 ring-gray-100 transition-transform group-hover:scale-110">
            <IssuerIcon className={`h-full w-full ${cert.issuer.includes('AWS') ? 'text-orange-500' : 'text-gray-700'}`} />
          </div>
          {cert.credentialId && (
            <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-mono font-medium text-gray-500">
              ID: {cert.credentialId}
            </div>
          )}
        </div>

        <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-blue-600">
          {cert.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LuAward className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{cert.issuer}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <LuCalendar className="h-4 w-4" />
          <span>Issued {cert.date}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <a
          href={cert.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-900 hover:text-white hover:shadow-lg ${
            !cert.link ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <span className="flex items-center gap-2">
            Verify Credential
            <LuExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>

      {/* Success Seal Animation on Hover */}
      <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <LuCheck className="h-24 w-24 text-green-500/10" />
      </div>
    </motion.div>
  );
};

const CertificationsApp: React.FC<CertificationsAppProps> = ({ mode }) => {
  const { certifications } = PORTFOLIO_DATA;
  const [filter, setFilter] = useState('');

  const filteredCerts = certifications.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    c.issuer.toLowerCase().includes(filter.toLowerCase())
  );

  const isMobile = mode === 'mobile';

  return (
    <div className={`h-full w-full overflow-hidden bg-gray-50/50 flex flex-col`}>
      {/* Header */}
      <div className="shrink-0 p-6 md:p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certifications</h1>
            <p className="mt-2 text-gray-600">
              Verified skills and professional achievements.
            </p>
          </div>

          <div className="relative">
             <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <input
                type="text"
                placeholder="Search certifications..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
             />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              {certifications.length}
            </span>
            <span>Total Certifications</span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className={`flex-1 overflow-y-auto p-6 md:p-8 pt-2 ${isMobile ? 'pb-24' : ''}`}>
        {filteredCerts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredCerts.map((cert, index) => (
                <CertificationCard key={cert.title + index} cert={cert} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-64 flex-col items-center justify-center text-center"
          >
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <LuAward className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No certifications found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CertificationsApp;
