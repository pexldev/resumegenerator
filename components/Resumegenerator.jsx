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

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.6fr',
      height: '100vh',
      backgroundColor: theme.colors.bgSecondary,
      background: theme.pageBg,
      overflow: 'hidden'
    }}>
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
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <ResumePreview data={formData} />
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
                âš ï¸ Content exceeds A4 page. Please remove some content to fit on one page.
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  );
};

export default ResumeGenerator;