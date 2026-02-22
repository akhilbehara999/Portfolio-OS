import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LuDownload,
  LuPrinter,
  LuZoomIn,
  LuZoomOut,
  LuFileText,
  LuCode,
  LuMail,
  LuMapPin,
  LuPhone,
  LuGlobe,
  LuLoader
} from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../../config/portfolio-data';

interface ResumeAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const ResumeContent: React.FC<{ data: typeof PORTFOLIO_DATA }> = ({ data }) => {
  const { personal, education, experience, skills, projects, certifications } = data;

  return (
    <div className="p-8 sm:p-12 space-y-8 h-full bg-white text-gray-900">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-2">{personal.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{personal.title}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <LuMail className="w-4 h-4" />
            <span>{personal.contact?.email || 'email@example.com'}</span>
          </div>
          {personal.contact?.phone && (
            <div className="flex items-center gap-1.5">
              <LuPhone className="w-4 h-4" />
              <span>{personal.contact.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <LuMapPin className="w-4 h-4" />
            <span>{personal.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LuGlobe className="w-4 h-4" />
            <span>portfolio-os.vercel.app</span>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-full h-px bg-blue-100"></span>
          Summary
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm text-justify">
          {personal.bio}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-full h-px bg-blue-100"></span>
          Experience
        </h2>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <span className="text-sm font-medium text-gray-500">{exp.duration}</span>
              </div>
              <div className="text-blue-700 font-medium text-sm mb-2">{exp.company}</div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap gap-1">
                {exp.techUsed.map(tech => (
                  <span key={tech} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-full h-px bg-blue-100"></span>
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{edu.university}</h3>
                <span className="text-sm font-medium text-gray-500">{edu.timeline}</span>
              </div>
              <div className="text-sm text-gray-800 mb-1">{edu.degree}</div>
              <p className="text-sm text-gray-600">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-full h-px bg-blue-100"></span>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 font-medium"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* Projects (Compact) */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-full h-px bg-blue-100"></span>
          Key Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.filter(p => p.featured).slice(0, 4).map((project, index) => (
            <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{project.title}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.description}</p>
              <div className="text-xs text-blue-600 font-medium">
                {project.techStack.slice(0, 3).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-full h-px bg-blue-100"></span>
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{cert.title}</span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-600">{cert.issuer}</span>
                </div>
                <span className="text-gray-500 font-medium">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const ResumeApp: React.FC<ResumeAppProps> = ({ mode }) => {
  const { personal, education, experience, skills, projects, certifications } = PORTFOLIO_DATA;
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const isMobile = mode === 'mobile';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/assets/resume.pdf', { method: 'HEAD' });
      if (response.ok) {
        const link = document.createElement('a');
        link.href = '/assets/resume.pdf';
        link.download = 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback to print if file not found
        alert('PDF file not found. Opening print dialog instead.');
        handlePrint();
      }
    } catch (error) {
      console.error('Download failed:', error);
      handlePrint();
    } finally {
      setIsDownloading(false);
    }
  };

  const generateMarkdown = () => {
    return `
# ${personal.name}
${personal.title}
${personal.location} | ${personal.contact?.email} | ${personal.contact?.phone || ''}

## Summary
${personal.bio}

## Experience
${experience.map(exp => `
### ${exp.role} at ${exp.company}
${exp.duration}
${exp.description.map(d => `- ${d}`).join('\n')}
Technologies: ${exp.techUsed.join(', ')}
`).join('\n')}

## Education
${education.map(edu => `
### ${edu.degree}
${edu.university} | ${edu.timeline} | GPA: ${edu.cgpa}
${edu.description}
`).join('\n')}

## Skills
${skills.map(skill => `- ${skill.name} (${skill.category})`).join('\n')}

## Projects
${projects.filter(p => p.featured).map(p => `
### ${p.title}
${p.description}
Tech: ${p.techStack.join(', ')}
`).join('\n')}

## Certifications
${certifications.map(cert => `- ${cert.title} (${cert.issuer}, ${cert.date})`).join('\n')}
    `.trim();
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 text-gray-900 overflow-hidden relative">
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
          .print-full-width { width: 100% !important; max-width: none !important; height: auto !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-white border-b border-gray-200 shadow-sm z-10 print-hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('formatted')}
            className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'formatted' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LuFileText className="w-4 h-4" />
            <span className="hidden sm:inline">Formatted</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'raw' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LuCode className="w-4 h-4" />
            <span className="hidden sm:inline">Raw / Markdown</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 mr-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900"
              >
                <LuZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900"
              >
                <LuZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Print"
          >
            <LuPrinter className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
          >
            {isDownloading ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuDownload className="w-4 h-4" />}
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4 sm:p-8 flex justify-center print-hidden">
        {viewMode === 'formatted' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: isMobile ? '100%' : '210mm',
              minHeight: isMobile ? 'auto' : '297mm', // A4 height
              transform: isMobile ? 'none' : `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              marginBottom: isMobile ? '0' : `${(zoom / 100) * 20}px`
            }}
            className={`bg-white shadow-xl ${isMobile ? 'rounded-none' : 'rounded-sm'} overflow-hidden print-full-width`}
          >
            <div ref={printRef}>
              <ResumeContent data={PORTFOLIO_DATA} />
            </div>
          </motion.div>
        ) : (
          <div className="h-full w-full bg-gray-900 text-gray-100 p-8 overflow-auto font-mono text-sm leading-relaxed rounded-lg shadow-xl max-w-4xl">
            <pre className="whitespace-pre-wrap">{generateMarkdown()}</pre>
          </div>
        )}
      </div>

      {/* Hidden Print Area */}
      <div className="hidden print:block print:w-full print:absolute print:top-0 print:left-0 print:z-50 bg-white">
          <ResumeContent data={PORTFOLIO_DATA} />
      </div>
    </div>
  );
};

export default ResumeApp;
