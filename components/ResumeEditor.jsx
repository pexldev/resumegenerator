import React from 'react';
import { theme } from '@/styles/theme';
import RichTextEditor from './RichTextEditor';

const ResumeEditor = ({ formData, setFormData, expandedSections, toggleSection, onEnhance, loadingStates = {} }) => {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArray = (field, index, subfield, value) => {
    const updated = [...formData[field]];
    if (subfield) {
      updated[index][subfield] = value;
    } else {
      updated[index] = value;
    }
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addItem = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      {/* Profile Section */}
      <Section
        title="Profile"
        subtitle="Basic personal information"
        isOpen={expandedSections.profile}
        onToggle={() => toggleSection('profile')}
      >
        <FormField label="Full Name">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Your full name"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Professional Title">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Senior Consultant"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Phone">
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+91-XXXXXXXXXX"
            style={inputStyle}
          />
        </FormField>
        <FormField label="LinkedIn">
          <input
            type="text"
            value={formData.linkedin}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/yourprofile"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Portfolio">
          <input
            type="text"
            value={formData.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="www.yourportfolio.com"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Photo">
          <div style={{
            position: 'relative',
            border: `2px dashed #1673FF`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f0f7ff',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6f2ff';
            e.currentTarget.style.borderColor = '#0d66d0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f7ff';
            e.currentTarget.style.borderColor = '#1673FF';
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    updateField('photo', event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            <div style={{ fontSize: '32px' }}>📷</div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0a0a0a' }}>
                {formData.photo ? '✓ Photo uploaded' : 'Upload your photo'}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8c8c8c' }}>
                {formData.photo ? 'Click to change' : 'Drag & drop or click to browse'}
              </p>
            </div>
          </div>
        </FormField>
      </Section>

      {/* Professional Summary */}
      <Section
        title="Professional Summary"
        subtitle="Overview of your career"
        isOpen={expandedSections.summary}
        onToggle={() => toggleSection('summary')}
      >
        <textarea
          value={formData.profileSummary}
          onChange={(e) => updateField('profileSummary', e.target.value)}
          placeholder="Write a compelling summary of your professional background..."
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'Inter, -apple-system, sans-serif'
          }}
        />
        <button
          onClick={() => onEnhance('profileSummary', undefined, undefined)}
          disabled={loadingStates['profileSummary_main_'] || false}
          style={{
            marginTop: theme.spacing.md,
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: '#0176D3',
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: '13px',
            fontWeight: '600',
            cursor: (loadingStates['profileSummary_main_'] || false) ? 'not-allowed' : 'pointer',
            opacity: (loadingStates['profileSummary_main_'] || false) ? 0.6 : 1,
            transition: 'all 0.2s',
            fontFamily: 'Inter, -apple-system, sans-serif'
          }}
        >
          {(loadingStates['profileSummary_main_'] || false) ? 'Enhancing...' : 'Enhance with Open AI'}
        </button>
      </Section>

      {/* Work Experience */}
      <Section
        title="Work Experience"
        subtitle={`${formData.workExperience.length} position${formData.workExperience.length !== 1 ? 's' : ''}`}
        isOpen={expandedSections.experience}
        onToggle={() => toggleSection('experience')}
      >
        {formData.workExperience.map((job, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: theme.spacing.lg }}>
            {formData.workExperience.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem('workExperience', idx);
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '0px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  zIndex: 10
                }}
                title="Remove"
              >
                ÃƒÆ’Ã¢â‚¬â€
              </button>
            )}
            <JobCard
              job={job}
              index={idx}
              onUpdate={updateArray}
              onEnhance={() => onEnhance('workExperience', idx, 'responsibilities')}
              loading={loadingStates[`workExperience_${idx}_responsibilities`] || false}
            />
          </div>
        ))}
        <button
          onClick={() => addItem('workExperience', { jobTitle: '', company: '', duration: '', responsibilities: '' })}
          style={{
            width: '100%',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.grey100,
            border: `1.5px dashed ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '13px',
            fontWeight: '600',
            color: theme.colors.primary,
            cursor: 'pointer',
            transition: `all ${theme.transition}`
          }}
        >
          + Add Experience
        </button>
      </Section>

      {/* Education */}
      <Section
        title="Education"
        subtitle={`${formData.education.length} degree${formData.education.length !== 1 ? 's' : ''}`}
        isOpen={expandedSections.education}
        onToggle={() => toggleSection('education')}
      >
        {formData.education.map((edu, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: theme.spacing.lg }}>
            {formData.education.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem('education', idx);
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '0px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  zIndex: 10
                }}
                title="Remove"
              >
                ÃƒÆ’Ã¢â‚¬â€
              </button>
            )}
            <EducationCard
              education={edu}
              index={idx}
              onUpdate={updateArray}
              onEnhance={() => onEnhance('education', idx, 'details')}
              loading={loadingStates[`education_${idx}_details`] || false}
            />
          </div>
        ))}
        <button
          onClick={() => addItem('education', { institution: '', degree: '', year: '', details: '' })}
          style={{
            width: '100%',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.grey100,
            border: `1.5px dashed ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '13px',
            fontWeight: '600',
            color: theme.colors.primary,
            cursor: 'pointer',
            transition: `all ${theme.transition}`
          }}
        >
          + Add Education
        </button>
      </Section>

      {/* Skills */}
      <Section
        title="Skills"
        subtitle={`${formData.skills.length} skill${formData.skills.length !== 1 ? 's' : ''}`}
        isOpen={expandedSections.skills}
        onToggle={() => toggleSection('skills')}
      >
        {formData.skills.map((skill, idx) => (
          <SkillChip
            key={idx}
            skill={skill}
            index={idx}
            onUpdate={updateArray}
            onRemove={() => removeItem('skills', idx)}
          />
        ))}
        <button
          onClick={() => addItem('skills', { skill: '', level: 'Intermediate' })}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.grey100,
            border: `1.5px dashed ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '13px',
            fontWeight: '600',
            color: theme.colors.primary,
            cursor: 'pointer',
            transition: `all ${theme.transition}`
          }}
        >
          + Add Skill
        </button>
      </Section>

      {/* Languages */}
      <Section
        title="Languages"
        subtitle={`${formData.languages.length} language${formData.languages.length !== 1 ? 's' : ''}`}
        isOpen={expandedSections.languages}
        onToggle={() => toggleSection('languages')}
      >
        {formData.languages.map((lang, idx) => (
          <LanguageItem
            key={idx}
            language={lang}
            index={idx}
            onUpdate={updateArray}
            onRemove={() => removeItem('languages', idx)}
          />
        ))}
        <button
          onClick={() => addItem('languages', { language: '', level: 'Fluent' })}
          style={{
            width: '100%',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.grey100,
            border: `1.5px dashed ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '13px',
            fontWeight: '600',
            color: theme.colors.primary,
            cursor: 'pointer',
            transition: `all ${theme.transition}`
          }}
        >
          + Add Language
        </button>
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        subtitle={`${formData.certifications.length} certification${formData.certifications.length !== 1 ? 's' : ''}`}
        isOpen={expandedSections.certifications}
        onToggle={() => toggleSection('certifications')}
      >
        {formData.certifications.map((cert, idx) => (
          <div key={idx} style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.md, alignItems: 'center' }}>
            <input
              type="text"
              value={cert.cert}
              onChange={(e) => updateArray('certifications', idx, undefined, { cert: e.target.value })}
              placeholder="Certification name"
              style={{ flex: 1, ...inputStyle }}
            />
            <button
              onClick={() => removeItem('certifications', idx)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                borderRadius: theme.borderRadius.sm,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem('certifications', { cert: '' })}
          style={{
            width: '100%',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.grey100,
            border: `1.5px dashed ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '13px',
            fontWeight: '600',
            color: theme.colors.primary,
            cursor: 'pointer',
            transition: `all ${theme.transition}`
          }}
        >
          + Add Certification
        </button>
      </Section>
    </div>
  );
};

const Section = ({ title, subtitle, isOpen, onToggle, children }) => (
  <div style={{
    backgroundColor: theme.colors.bgPrimary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.huge,
    boxShadow: theme.shadow.sm,
    transition: `all ${theme.transition}`,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer'
    }}
    onClick={onToggle}
    >
      <div>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: theme.colors.textLight,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '13px',
          color: theme.colors.textMuted,
          margin: `${theme.spacing.sm} 0 0 0`,
          fontWeight: '400'
        }}>
          {subtitle}
        </p>
      </div>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isOpen ? theme.colors.blueLight : 'transparent',
        transition: `all ${theme.transition}`,
        pointerEvents: 'none'
      }}>
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none"
          style={{
            transition: `transform ${theme.transition}`,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <path 
            d="M3 5.5L7 9.5L11 5.5" 
            stroke={isOpen ? theme.colors.blue : theme.colors.textMuted}
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
    {isOpen && (
      <div style={{ marginTop: theme.spacing.xxl, pointerEvents: 'auto' }}>
        {children}
      </div>
    )}
  </div>
);

const FormField = ({ label, children }) => (
  <div style={{ marginBottom: theme.spacing.lg }}>
    <label style={{
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui'
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.md,
  fontSize: '15px',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui',
  transition: `all ${theme.transition}`,
  boxSizing: 'border-box',
  color: theme.colors.textPrimary,
  backgroundColor: theme.colors.bgLight,
  outline: 'none',
};

const JobCard = ({ job, index, onUpdate, onEnhance, loading }) => (
  <div style={{
    backgroundColor: theme.colors.grey50,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    position: 'relative'
  }}>
    <FormField label="Job Title">
      <input
        type="text"
        value={job.jobTitle}
        onChange={(e) => onUpdate('workExperience', index, 'jobTitle', e.target.value)}
        placeholder="e.g., Senior Consultant"
        style={inputStyle}
      />
    </FormField>
    <FormField label="Company">
      <input
        type="text"
        value={job.company}
        onChange={(e) => onUpdate('workExperience', index, 'company', e.target.value)}
        placeholder="Company name"
        style={inputStyle}
      />
    </FormField>
    <FormField label="Duration">
      <input
        type="text"
        value={job.duration}
        onChange={(e) => onUpdate('workExperience', index, 'duration', e.target.value)}
        placeholder="Jan 2020 - Present"
        style={inputStyle}
      />
    </FormField>
    <FormField label="Responsibilities & Details">
      <RichTextEditor
        value={Array.isArray(job.responsibilities) ? job.responsibilities.join('<br>') : job.responsibilities || ''}
        onChange={(html) => onUpdate('workExperience', index, 'responsibilities', html)}
        placeholder="Describe your key responsibilities and achievements..."
      />
    </FormField>
    <button
      onClick={onEnhance}
      disabled={loading}
      style={{
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        backgroundColor: '#0176D3',
        color: 'white',
        border: 'none',
        borderRadius: theme.borderRadius.md,
        fontSize: '13px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm
      }}
    >
      {loading ? 'Enhancing...' : 'Enhance with Open AI'}
    </button>
  </div>
);

const EducationCard = ({ education, index, onUpdate, onEnhance, loading }) => (
  <div style={{
    backgroundColor: theme.colors.grey50,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    position: 'relative'
  }}>
    <FormField label="Institution">
      <input
        type="text"
        value={education.institution}
        onChange={(e) => onUpdate('education', index, 'institution', e.target.value)}
        placeholder="University name"
        style={inputStyle}
      />
    </FormField>
    <FormField label="Degree">
      <input
        type="text"
        value={education.degree}
        onChange={(e) => onUpdate('education', index, 'degree', e.target.value)}
        placeholder="B.Sc, M.B.A, etc."
        style={inputStyle}
      />
    </FormField>
    <FormField label="Year">
      <input
        type="text"
        value={education.year}
        onChange={(e) => onUpdate('education', index, 'year', e.target.value)}
        placeholder="2009-2013"
        style={inputStyle}
      />
    </FormField>
    <FormField label="Details">
      <RichTextEditor
        value={education.details}
        onChange={(html) => {
          onUpdate('education', index, 'details', html);
        }}
        placeholder="Describe your academic achievements, coursework, and relevant details..."
      />
    </FormField>
    <button
      onClick={onEnhance}
      disabled={loading}
      style={{
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        backgroundColor: '#0176D3',
        color: 'white',
        border: 'none',
        borderRadius: theme.borderRadius.md,
        fontSize: '13px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm
      }}
    >
      {loading ? 'Enhancing...' : 'Enhance with Open AI'}
    </button>
  </div>
);

const SkillChip = ({ skill, index, onUpdate, onRemove }) => {
  const levelPercentages = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100
  };

  return (
    <div style={{
      width: '100%',
      marginBottom: theme.spacing.lg
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        gap: theme.spacing.md,
        alignItems: 'center',
        marginBottom: theme.spacing.sm
      }}>
        <input
          type="text"
          value={skill.skill}
          onChange={(e) => onUpdate('skills', index, 'skill', e.target.value)}
          placeholder="e.g., Salesforce"
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <select
          value={skill.level}
          onChange={(e) => onUpdate('skills', index, 'level', e.target.value)}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '13px',
            outline: 'none',
            backgroundColor: 'white'
          }}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
        <button
          onClick={onRemove}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: 'none',
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Remove
        </button>
      </div>
      <div style={{ 
        width: '100%', 
        height: '6px', 
        backgroundColor: '#E5E7EB', 
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${levelPercentages[skill.level] || 50}%`,
          height: '100%',
          backgroundColor: '#0176D3',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

const LanguageItem = ({ language, index, onUpdate, onRemove }) => {
  const levelPercentages = {
    'Basic': 33,
    'Intermediate': 50,
    'Advanced': 66,
    'Fluent': 100,
    'Native': 100
  };

  return (
    <div style={{ marginBottom: theme.spacing.xl }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        gap: theme.spacing.md,
        alignItems: 'center',
        marginBottom: theme.spacing.sm
      }}>
        <input
          type="text"
          value={language.language}
          onChange={(e) => onUpdate('languages', index, 'language', e.target.value)}
          placeholder="e.g., English"
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <select
          value={language.level}
          onChange={(e) => onUpdate('languages', index, 'level', e.target.value)}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.borderColor}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '13px',
            outline: 'none',
            backgroundColor: 'white'
          }}
        >
          <option>Native</option>
          <option>Fluent</option>
          <option>Advanced</option>
          <option>Intermediate</option>
          <option>Basic</option>
        </select>
        <button
          onClick={onRemove}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: 'none',
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Remove
        </button>
      </div>
      <div style={{ 
        width: '100%', 
        height: '6px', 
        backgroundColor: '#E5E7EB', 
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${levelPercentages[language.level] || 50}%`,
          height: '100%',
          backgroundColor: '#0176D3',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default ResumeEditor;