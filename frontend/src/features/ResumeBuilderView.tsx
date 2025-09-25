import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import jsPDF from 'jspdf';

interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

const ResumeBuilderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();

  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, Anytown, USA');

  const [experience, setExperience] = useState<WorkExperience[]>([
    { company: 'Tech Corp', role: 'Software Engineer', startDate: '2020-01-01', endDate: '2023-12-31', description: 'Developed and maintained web applications.' }
  ]);
  const [education, setEducation] = useState<Education[]>([
    { institution: 'State University', degree: 'B.S. in Computer Science', startDate: '2016-09-01', endDate: '2020-05-31' }
  ]);
  const [skills, setSkills] = useState('React, TypeScript, Node.js, SQL');

  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
  };

  const addExperience = () => setExperience([...experience, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
  const removeExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const addEducation = () => setEducation([...education, { institution: '', degree: '', startDate: '', endDate: '' }]);
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const handleGeneratePdf = () => {
    try {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(22);
      doc.text(name, 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`${email} | ${phone} | ${address}`, 20, y);
      y += 15;

      // Experience
      doc.setFontSize(16);
      doc.text('Work Experience', 20, y);
      y += 8;
      doc.setFontSize(12);
      experience.forEach(exp => {
        doc.setFontSize(14);
        doc.text(exp.role, 20, y);
        doc.setFontSize(12);
        doc.text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`, 20, y + 6);
        doc.text(exp.description, 25, y + 12, { maxWidth: 160 });
        y += 25;
      });

      // Education
      y += 5;
      doc.setFontSize(16);
      doc.text('Education', 20, y);
      y += 8;
      doc.setFontSize(12);
      education.forEach(edu => {
        doc.setFontSize(14);
        doc.text(edu.degree, 20, y);
        doc.setFontSize(12);
        doc.text(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`, 20, y + 6);
        y += 15;
      });

      // Skills
      y += 5;
      doc.setFontSize(16);
      doc.text('Skills', 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(skills, 20, y, { maxWidth: 170 });

      doc.save('resume.pdf');
      addToast({ type: 'success', message: 'Resume PDF generated successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate PDF.' });
      console.error(error);
    }
  };

  return (
    <ToolPageLayout title="Resume Builder" onBack={onBack} description="Create a professional resume from a form.">
      <div className="space-y-6">
        {/* Personal Details */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Work Experience */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Work Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="space-y-2 mb-4 p-2 border-t">
              <input type="text" placeholder="Company" value={exp.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Role" value={exp.role} onChange={e => handleExperienceChange(index, 'role', e.target.value)} className="w-full p-2 border rounded" />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" placeholder="Start Date" value={exp.startDate} onChange={e => handleExperienceChange(index, 'startDate', e.target.value)} className="w-full p-2 border rounded" />
                <input type="date" placeholder="End Date" value={exp.endDate} onChange={e => handleExperienceChange(index, 'endDate', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <textarea placeholder="Description" value={exp.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)} className="w-full p-2 border rounded" />
              <button onClick={() => removeExperience(index)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Remove</button>
            </div>
          ))}
          <button onClick={addExperience} className="px-4 py-2 bg-gray-200 rounded">Add Experience</button>
        </div>

        {/* Education */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="space-y-2 mb-4 p-2 border-t">
              <input type="text" placeholder="Institution" value={edu.institution} onChange={e => handleEducationChange(index, 'institution', e.target.value)} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} className="w-full p-2 border rounded" />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" placeholder="Start Date" value={edu.startDate} onChange={e => handleEducationChange(index, 'startDate', e.target.value)} className="w-full p-2 border rounded" />
                <input type="date" placeholder="End Date" value={edu.endDate} onChange={e => handleEducationChange(index, 'endDate', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <button onClick={() => removeEducation(index)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Remove</button>
            </div>
          ))}
          <button onClick={addEducation} className="px-4 py-2 bg-gray-200 rounded">Add Education</button>
        </div>

        {/* Skills */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Skills</h3>
          <textarea placeholder="Comma-separated skills" value={skills} onChange={e => setSkills(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <button onClick={handleGeneratePdf} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Generate PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default ResumeBuilderView;
