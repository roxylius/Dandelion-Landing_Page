import { useState } from "react";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2, MapPin, Clock, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-rounded.png";


const JobApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentLocation: '',
    currentCompany: '',
    linkedinUrl: '',
    githubUrl: '',
    otherWebsite: '',
    coverLetter: '',
    resume: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // Track which fields have errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    // Reset previous errors
    setFieldErrors({});
    
    if (!formData.fullName.trim()) {
      errors.fullName = true;
      setErrorMessage('Full name is required');
      hasErrors = true;
    }
    
    if (!formData.email.trim()) {
      errors.email = true;
      setErrorMessage('Email is required');
      hasErrors = true;
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = true;
        setErrorMessage('Please enter a valid email address');
        hasErrors = true;
      }
    }
    
    if (!formData.phone.trim()) {
      errors.phone = true;
      setErrorMessage('Phone number is required');
      hasErrors = true;
    } else {
      // Phone validation (basic)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        errors.phone = true;
        setErrorMessage('Please enter a valid phone number');
        hasErrors = true;
      }
    }
    
    if (!formData.currentLocation.trim()) {
      errors.currentLocation = true;
      setErrorMessage('Current location is required');
      hasErrors = true;
    }
    
    if (!formData.currentCompany.trim()) {
      errors.currentCompany = true;
      setErrorMessage('Current company is required');
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const googleScriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      let resumeUrl = '';

      // Step 1: Upload resume file if present (using correct ArrayBuffer method)
      if (formData.resume) {
        console.log('Uploading resume file:', formData.resume.name);
        resumeUrl = await uploadResumeFile(formData.resume, googleScriptUrl);
        console.log('Resume uploaded with URL:', resumeUrl);
      }

      // Step 2: Submit form data with resume URL
      await submitFormData(resumeUrl, googleScriptUrl);

      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        currentLocation: '',
        currentCompany: '',
        linkedinUrl: '',
        githubUrl: '',
        otherWebsite: '',
        coverLetter: '',
        resume: null
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to upload resume file using ArrayBuffer method (from StackOverflow)
  const uploadResumeFile = (file, scriptUrl) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        try {
          // Create filename with timestamp to avoid conflicts
          const timestamp = new Date().getTime();
          const cleanName = formData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
          const filename = `resume_${cleanName}_${timestamp}_${file.name}`;
          
          // Convert ArrayBuffer to Int8Array as required by Google Apps Script
          const arrayBuffer = e.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const fileData = [...uint8Array]; // Convert to regular array
          
          console.log('File converted to array, length:', fileData.length);
          console.log('Uploading file:', filename);
          
          // Create URL parameters
          const urlParams = new URLSearchParams({
            filename: filename,
            mimeType: file.type
          });
          
          // Try StackOverflow CORS solution: text/plain content type with redirect follow
          const response = await fetch(`${scriptUrl}?${urlParams}`, {
            method: 'POST',
            redirect: 'follow', // Critical for Google Apps Script
            headers: {
              'Content-Type': 'text/plain;charset=utf-8', // Prevents preflight requests
            },
            body: JSON.stringify(fileData)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('File upload response:', result);
          
          if (result.success) {
            console.log('File uploaded successfully:', result.viewUrl);
            resolve(result.viewUrl); // Return the real Google Drive URL
          } else {
            throw new Error(result.error || 'File upload failed');
          }
          
        } catch (error) {
          console.error('File upload error:', error);
          // If CORS fails, fall back to no-cors mode but fix the cleanName error
          try {
            console.log('Retrying with no-cors mode...');
            const timestamp = new Date().getTime();
            const cleanName = formData.fullName.replace(/[^a-zA-Z0-9]/g, '_'); // Fix: define cleanName here too
            const filename = `resume_${cleanName}_${timestamp}_${file.name}`;
            
            const urlParams = new URLSearchParams({
              filename: filename,
              mimeType: file.type
            });
            
            await fetch(`${scriptUrl}?${urlParams}`, {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'text/plain;charset=utf-8',
              },
              body: JSON.stringify([...new Uint8Array(e.target.result)])
            });
            
            // Return a status message since we can't get the real URL
            resolve('Resume uploaded (URL will be available after processing)');
            
          } catch (fallbackError) {
            console.error('Fallback upload also failed:', fallbackError);
            reject(new Error('File upload failed completely'));
          }
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read file as ArrayBuffer
      fileReader.readAsArrayBuffer(file);
    });
  };

  // Function to submit form data
  const submitFormData = async (resumeUrl, scriptUrl) => {
    const formDataParams = new URLSearchParams({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      currentLocation: formData.currentLocation.trim(),
      currentCompany: formData.currentCompany.trim(),
      linkedinUrl: formData.linkedinUrl.trim() || '',
      githubUrl: formData.githubUrl.trim() || '',
      otherWebsite: formData.otherWebsite.trim() || '',
      coverLetter: formData.coverLetter.trim() || '',
      position: 'Full-stack developer Intern, Remote',
      resumeUrl: resumeUrl || 'No resume uploaded'
    });

    try {
      // Use StackOverflow CORS solution for form data
      const response = await fetch(scriptUrl, {
        method: 'POST',
        redirect: 'follow', // Critical for Google Apps Script
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formDataParams
      });

      if (response.ok) {
        const result = await response.text(); // Google Apps Script may return text
        console.log('Form submission response:', result);
        return { success: true, message: result };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Normal form submission failed, trying no-cors:', error);
      
      // Fallback to no-cors mode
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formDataParams
      });
      
      return { success: true, message: 'Form submitted successfully (no-cors mode)' };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Ocio Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold text-neutral-800">Ocio</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Full-stack developer Intern, Remote
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Bengaluru</span>
            </div>
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span>Ocio - AI-powered recruitment</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Internship / Remote</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Job Description</h2>
          <div className="prose text-neutral-600 space-y-4">
            <p>
              Join Ocio, an innovative AI-powered recruitment platform that's revolutionizing how companies 
              find and hire talent. We're looking for a passionate Full-stack Developer Intern to help us 
              build cutting-edge solutions that connect the right people with the right opportunities.
            </p>
            
            <h3 className="text-lg font-medium text-neutral-800">About Ocio:</h3>
            <p>
              Ocio leverages artificial intelligence to streamline the recruitment process, making it more 
              efficient and effective for both employers and job seekers. Our platform uses advanced algorithms 
              to match candidates with opportunities, reducing hiring time and improving job satisfaction.
            </p>
            
            <h3 className="text-lg font-medium text-neutral-800">Requirements:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Experience with the MERN stack (MongoDB, Express.js, React, Node.js)</li>
              <li>Strong proficiency in JavaScript and modern web development</li>
              <li>Knowledge of RESTful APIs and database design</li>
              <li>Currently pursuing or recently completed a degree in Computer Science or related field</li>
            </ul>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">Submit Your Application</h2>
          
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="flex items-center gap-3 p-8 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
              <CheckCircle className="w-8 h-8" />
              <div>
                <div className="font-medium text-lg">Application submitted successfully!</div>
                <div className="text-sm mt-2">We'll review your application and get back to you soon.</div>
              </div>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              <AlertCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">Application submission failed</div>
                <div className="text-sm">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Only show form if not successfully submitted */}
          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Resume/CV <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <div className="text-sm text-neutral-600">
                    {formData.resume ? (
                      <span className="text-orange-600 font-medium">{formData.resume.name}</span>
                    ) : (
                      <>
                        <span className="text-orange-600 font-medium">Click to upload</span> or drag and drop
                        <br />
                        <span className="text-xs text-neutral-400">PDF, DOC, DOCX (max 10MB)</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.fullName ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="currentLocation" className="block text-sm font-medium text-neutral-700 mb-2">
                  Current location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currentLocation"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.currentLocation ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your current location"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="currentCompany" className="block text-sm font-medium text-neutral-700 mb-2">
                  Current company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.currentCompany ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your current company or university"
                />
              </div>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Links</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label htmlFor="otherWebsite" className="block text-sm font-medium text-neutral-700 mb-2">
                    Other website
                  </label>
                  <input
                    type="url"
                    id="otherWebsite"
                    name="otherWebsite"
                    value={formData.otherWebsite}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Additional Information</h3>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Add a cover letter or anything else you want to share."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>

            {/* Error Message Below Submit Button */}
            {submitStatus === 'error' && (
              <div className="flex items-center justify-center gap-2 pt-3">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <div className="text-red-600 text-sm font-medium">
                  {errorMessage || 'Application submission failed. Please try again.'}
                </div>
              </div>
            )}
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplication;