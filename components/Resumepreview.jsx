import React from 'react';
import { theme } from '@/styles/theme';

const SidebarSection = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{
      fontSize: '11px',
      fontWeight: '600',
      color: 'white',
      textTransform: 'uppercase',
      marginBottom: '10px',
      paddingBottom: '8px',
      borderBottom: '1px solid #3B82F6',
      letterSpacing: '0.08em',
      margin: 0
    }}>
      {title}
    </h3>
    <div style={{ marginTop: '10px' }}>
      {children}
    </div>
  </div>
);

const ContactItem = ({ text }) => (
  <div style={{
    fontSize: '10px',
    backgroundColor: 'rgba(22, 115, 255, 0.06)',
    padding: '8px 10px',
    borderRadius: '5px',
    marginBottom: '6px',
    borderLeft: '1.5px solid #3B82F6',
    wordBreak: 'break-word',
    lineHeight: '1.4',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }}>
    {text}
  </div>
);

const CertItem = ({ text }) => (
  <div style={{
    fontSize: '10px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: '8px 10px',
    borderRadius: '5px',
    marginBottom: '6px',
    borderLeft: '1.5px solid #3B82F6',
    lineHeight: '1.4'
  }}>
    {text}
  </div>
);

const SkillBar = ({ skill, level }) => {
  const levelMap = { 'Beginner': 25, 'Intermediate': 50, 'Advanced': 75, 'Expert': 100 };
  const width = levelMap[level] || 60;

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9.5px',
        marginBottom: '4px',
        fontWeight: '500'
      }}>
        <span>{skill}</span>
        <span style={{ opacity: 0.6 }}>{level}</span>
      </div>
      <div style={{
        height: '3px',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: '1px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
          width: width + '%',
          transition: 'width 200ms ease'
        }} />
      </div>
    </div>
  );
};

const LanguageItemComponent = ({ language, level }) => {
  const levelMap = { 'Native': 100, 'Fluent': 80, 'Advanced': 60, 'Intermediate': 40, 'Basic': 20 };
  const width = levelMap[level] || 50;

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9.5px',
        marginBottom: '4px',
        fontWeight: '500'
      }}>
        <span>{language}</span>
        <span style={{ opacity: 0.6 }}>{level}</span>
      </div>
      <div style={{
        height: '3px',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: '1px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
          width: width + '%',
          transition: 'width 200ms ease'
        }} />
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <h3 style={{
      fontSize: '11px',
      fontWeight: '600',
      color: theme.colors.textPrimary,
      textTransform: 'uppercase',
      margin: '0 0 10px 0',
      paddingBottom: '6px',
      borderBottom: '1px solid #E5E7EB',
      letterSpacing: '0.05em'
    }}>
      {title}
    </h3>
    <div style={{ marginTop: '10px' }}>
      {children}
    </div>
  </div>
);

const ResumePreview = ({ data }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      width: '100%',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui',
      fontSize: '11px',
      lineHeight: '1.6',
      color: theme.colors.textSecondary,
    }}>
      {/* Left Sidebar */}
      <div style={{
        background: theme.sidebarGradient,
        color: 'white',
        padding: '16px 14px',
        marginRight: '16px'
      }}>
        {/* Profile Photo */}
        {data.photo && (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 14px',
            overflow: 'hidden',
            border: '3px solid #4A90E2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Contact */}
        {(data.phone || data.email || data.linkedin || data.website) && (
          <SidebarSection title="CONTACT">
            {data.phone && <ContactItem text={data.phone} />}
            {data.email && <ContactItem text={data.email} />}
            {data.linkedin && <ContactItem text={data.linkedin} />}
            {data.website && <ContactItem text={data.website} />}
          </SidebarSection>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <SidebarSection title="SKILLS">
            {data.skills.map((skill, idx) => (
              <SkillBar key={idx} skill={skill.skill} level={skill.level} />
            ))}
          </SidebarSection>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <SidebarSection title="LANGUAGES">
            {data.languages.map((lang, idx) => (
              <LanguageItemComponent key={idx} language={lang.language} level={lang.level} />
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <SidebarSection title="CERTIFICATIONS">
            {data.certifications.map((cert, idx) => (
              <CertItem key={idx} text={cert.cert} />
            ))}
          </SidebarSection>
        )}
      </div>

      {/* Right Content */}
      <div style={{ padding: '24px 24px 24px 0' }}>
        {/* Header */}
        {(data.name || data.title) && (
          <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #E5E7EB' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {data.name}
            </h1>
            {data.title && (
              <h2 style={{
                fontSize: '16px',
                color: '#6B7280',
                fontWeight: '500',
                margin: '8px 0 0 0',
                letterSpacing: '0.3px'
              }}>
                {data.title}
              </h2>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {data.profileSummary && (
          <Section title="PROFESSIONAL SUMMARY">
            <p style={{ fontSize: '10.5px', lineHeight: '1.6', color: theme.colors.textSecondary, margin: 0 }}>
              {data.profileSummary}
            </p>
          </Section>
        )}

        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <Section title="WORK EXPERIENCE">
            {data.workExperience.map((job, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '600',
                      color: theme.colors.textPrimary
                    }}>
                      {job.jobTitle}
                    </span>
                    {job.company && (
                      <span style={{
                        fontSize: '10px',
                        color: '#3B82F6',
                        fontWeight: '600',
                        marginLeft: '6px'
                      }}>
                        - {job.company}
                      </span>
                    )}
                  </div>
                  {job.duration && (
                    <span style={{ 
                      fontSize: '9.5px', 
                      color: theme.colors.textMuted, 
                      marginLeft: '16px',
                      whiteSpace: 'nowrap'
                    }}>
                      {job.duration}
                    </span>
                  )}
                </div>
                {job.responsibilities && typeof job.responsibilities === 'string' && job.responsibilities.trim() && (
                  <div
                    style={{
                      fontSize: '9.5px',
                      margin: '4px 0 0 0',
                      paddingLeft: '12px',
                      color: theme.colors.textSecondary,
                      lineHeight: '1.4'
                    }}
                    dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                  />
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <Section title="EDUCATION">
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '600',
                      color: theme.colors.textPrimary
                    }}>
                      {edu.institution}
                    </span>
                    {edu.degree && (
                      <span style={{
                        fontSize: '9.5px',
                        color: theme.colors.textSecondary,
                        marginLeft: '6px'
                      }}>
                        - {edu.degree}
                      </span>
                    )}
                  </div>
                  {edu.year && (
                    <span style={{ 
                      fontSize: '9.5px', 
                      color: theme.colors.textMuted,
                      marginLeft: '16px',
                      whiteSpace: 'nowrap'
                    }}>
                      {edu.year}
                    </span>
                  )}
                </div>
                {edu.details && (
                  <div style={{
                    fontSize: '9px',
                    color: theme.colors.textMuted,
                    marginTop: '3px',
                    fontStyle: 'italic',
                    lineHeight: '1.4'
                  }}>
                    {edu.details}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;