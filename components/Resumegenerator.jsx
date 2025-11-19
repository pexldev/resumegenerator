import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { theme } from '@/styles/theme';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './Resumepreview';

const ResumeGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    photo: null,
    profileSummary: '',
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    workExperience: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    certifications: false,
    languages: false,
  });

  const [loadingStates, setLoadingStates] = useState({});
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview' for mobile
  const resumeRef = useRef();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const enhanceContent = async (field, index, subfield) => {
  const key = `${field}_${index ?? 'main'}_${subfield ?? ''}`;
  setLoadingStates(prev => ({ ...prev, [key]: true }));

  let text = '';

  if (field === 'workExperience' && index !== undefined) {
    text = Array.isArray(formData[field][index].responsibilities) 
      ? formData[field][index].responsibilities.join('\n')
      : formData[field][index].responsibilities || '';
  } else if (index !== undefined && field) {
    text = formData[field][index][subfield];
  } else {
    text = formData[field];
  }

  if (!text.trim()) {
    alert('Please add content before enhancing');
    setLoadingStates(prev => ({ ...prev, [key]: false }));
    return;
  }

  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), field })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to enhance content');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let enhanced = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              enhanced += parsed.content;

              // Typewriter effect - update immediately with each chunk
              if (field === 'workExperience' && index !== undefined) {
                const updated = [...formData[field]];
                updated[index].responsibilities = enhanced;
                setFormData(prev => ({ ...prev, [field]: updated }));
              } else if (index !== undefined) {
                const updated = [...formData[field]];
                updated[index][subfield] = enhanced;
                setFormData(prev => ({ ...prev, [field]: updated }));
              } else {
                setFormData(prev => ({ ...prev, [field]: enhanced }));
              }
              
              // Small delay for smoother typewriter effect
              await new Promise(resolve => setTimeout(resolve, 20));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to enhance: ' + error.message);
  }
  setLoadingStates(prev => ({ ...prev, [key]: false }));
};

  const generatePDF = () => {
    const element = resumeRef.current;
    const originalBorderRadius = element.style.borderRadius;
    const originalBoxShadow = element.style.boxShadow;
    
    element.style.borderRadius = '0';
    element.style.boxShadow = 'none';
    
    const opt = {
      margin: 0,
      filename: `${formData.name || 'resume'}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.borderRadius = originalBorderRadius;
      element.style.boxShadow = originalBoxShadow;
    });
  };

  // Check if form is empty
  const isFormEmpty = !formData.name && 
    !formData.title && 
    !formData.email && 
    !formData.phone && 
    !formData.profileSummary &&
    formData.workExperience.length === 0 &&
    formData.education.length === 0 &&
    formData.skills.length === 0;

  return (
    <>
      {/* Desktop Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        height: '100vh',
        backgroundColor: theme.colors.bgSecondary,
        background: theme.pageBg,
        overflow: 'hidden'
      }}
      className="desktop-layout">
        {/* Left Editor Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.colors.bgPrimary,
          borderRight: '1px solid ' + theme.colors.border,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: theme.spacing.xxl,
            borderBottom: '1px solid ' + theme.colors.border,
            backgroundColor: theme.colors.bgPrimary,
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: theme.colors.textPrimary,
              margin: 0,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
            }}>
              Resume Builder
            </h1>
            <p style={{
              fontSize: '14px',
              color: theme.colors.textMuted,
              margin: theme.spacing.md + ' 0 0 0',
              fontWeight: '400'
            }}>
              Craft your professional story
            </p>
            
            {/* Step Indicator */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#1673FF',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>1</div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textPrimary }}>Fill</span>
              </div>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#E5E7EB' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>2</div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textMuted }}>Preview</span>
              </div>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#E5E7EB' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>3</div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textMuted }}>Download</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ overflowY: 'auto', flex: 1, padding: theme.spacing.editorPadding }}>
            <ResumeEditor
              formData={formData}
              setFormData={setFormData}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onEnhance={enhanceContent}
              loadingStates={loadingStates}
            />
          </div>

          {/* Footer Action */}
          <div style={{
            padding: theme.spacing.editorPadding,
            borderTop: '1px solid ' + theme.colors.border,
            backgroundColor: theme.colors.bgPrimary,
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={generatePDF}
              style={{
                padding: theme.spacing.lg + ' ' + theme.spacing.xxl,
                backgroundColor: theme.colors.accent,
                color: theme.colors.bgPrimary,
                border: 'none',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all ' + theme.transition,
                boxShadow: theme.shadow.sm,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📥 Download PDF
            </button>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.colors.bgSecondary,
          overflow: 'hidden'
        }}>
          {/* Toolbar */}
          <div style={{
            padding: theme.spacing.lg + ' ' + theme.spacing.xxl,
            borderBottom: '1px solid ' + theme.colors.border,
            backgroundColor: theme.colors.bgPrimary,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            gap: theme.spacing.lg,
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '13px',
              color: theme.colors.textMuted,
              fontWeight: '500',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
            }}>
              Preview
            </span>
            <button
              onClick={generatePDF}
              style={{
                padding: theme.spacing.sm + ' ' + theme.spacing.lg,
                backgroundColor: theme.colors.bgLight,
                border: '1px solid ' + theme.colors.border,
                borderRadius: theme.borderRadius.sm,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                color: theme.colors.textPrimary,
                transition: 'all ' + theme.transition,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.borderLight;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.colors.bgLight;
              }}
            >
              📥 Export PDF
            </button>
          </div>

          {/* Preview Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '0',
            backgroundColor: theme.colors.bgSecondary
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '794px'  }}>
              <div
                ref={resumeRef}
                style={{
                  width: '100%',
                  backgroundColor: theme.colors.bgPrimary,
                  padding: '0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui',
                  animation: 'fadeIn 300ms ' + theme.transition,
                  minHeight: '842px',
                  maxHeight: '842px',
                  overflowY: 'hidden',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)'
                }}
              >
                {isFormEmpty ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2, marginBottom: '24px' }}>
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#1673FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: theme.colors.textPrimary,
                      margin: '0 0 8px 0'
                    }}>
                      Your Resume Preview
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: theme.colors.textMuted,
                      margin: 0,
                      maxWidth: '300px',
                      lineHeight: '1.5'
                    }}>
                      Start filling in your details on the left to see your professional resume come to life here
                    </p>
                    <div style={{
                      marginTop: '32px',
                      padding: '12px 24px',
                      backgroundColor: '#F0F7FF',
                      borderRadius: '8px',
                      border: '1px solid #D1E6FF'
                    }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#1673FF',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        👈 Begin with the Profile section
                      </p>
                    </div>
                  </div>
                ) : (
                  <ResumePreview data={formData} />
                )}
              </div>
              {resumeRef.current && resumeRef.current.scrollHeight > 842 && (
                <div style={{
                  marginTop: theme.spacing.lg,
                  padding: theme.spacing.md + ' ' + theme.spacing.lg,
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: theme.borderRadius.sm,
                  fontSize: '13px',
                  color: '#92400e',
                  fontWeight: '500'
                }}>
                  ⚠️ Content exceeds A4 page. Please remove some content to fit on one page.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-layout" style={{
        display: 'none',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: theme.colors.bgSecondary
      }}>
        {/* Mobile Tab Bar */}
        <div style={{
          display: 'flex',
          backgroundColor: theme.colors.bgPrimary,
          borderBottom: '2px solid ' + theme.colors.border,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <button
            onClick={() => setActiveTab('edit')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: activeTab === 'edit' ? theme.colors.bgPrimary : theme.colors.bgLight,
              border: 'none',
              borderBottom: activeTab === 'edit' ? '3px solid ' + theme.colors.accent : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'edit' ? theme.colors.accent : theme.colors.textMuted,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: activeTab === 'preview' ? theme.colors.bgPrimary : theme.colors.bgLight,
              border: 'none',
              borderBottom: activeTab === 'preview' ? '3px solid ' + theme.colors.accent : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: activeTab === 'preview' ? theme.colors.accent : theme.colors.textMuted,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            👁️ Preview
          </button>
        </div>

        {/* Mobile Content */}
        {activeTab === 'edit' ? (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: theme.colors.bgSecondary
          }}>
            <ResumeEditor
              formData={formData}
              setFormData={setFormData}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onEnhance={enhanceContent}
              loadingStates={loadingStates}
            />
          </div>
        ) : (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '20px',
            backgroundColor: theme.colors.bgSecondary
          }}>
            <div
              ref={resumeRef}
              style={{
                width: '794px',
                minWidth: '794px',
                backgroundColor: theme.colors.bgPrimary,
                margin: '0 auto',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                minHeight: '842px'
              }}
            >
              {isFormEmpty ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '842px',
                  padding: '40px',
                  textAlign: 'center'
                }}>
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2, marginBottom: '20px' }}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#1673FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                    margin: '0 0 8px 0'
                  }}>
                    Your Resume Preview
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: theme.colors.textMuted,
                    margin: 0,
                    maxWidth: '250px',
                    lineHeight: '1.5'
                  }}>
                    Switch to Edit tab and start filling your details
                  </p>
                </div>
              ) : (
                <ResumePreview data={formData} />
              )}
            </div>
          </div>
        )}

        {/* Mobile Footer */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: theme.colors.bgPrimary,
          borderTop: '1px solid ' + theme.colors.border,
          position: 'sticky',
          bottom: 0
        }}>
          <button
            onClick={generatePDF}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: theme.colors.accent,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0.95;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 1024px) {
          .desktop-layout {
            display: none !important;
          }
          .mobile-layout {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default ResumeGenerator;