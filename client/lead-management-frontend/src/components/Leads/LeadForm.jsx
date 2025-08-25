import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';
import leadService from '../../services/leadService';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    source: 'website',
    status: 'new',
    score: 0,
    lead_value: 0,
    last_activity_at: '',
    is_qualified: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      loadLead();
    }
  }, [id, isEdit]);

  const loadLead = async () => {
    try {
      setIsLoading(true);
      const lead = await leadService.getLead(id);
      
      // Format date for input field
      const formattedData = {
        ...lead,
        last_activity_at: lead.last_activity_at 
          ? new Date(lead.last_activity_at).toISOString().slice(0, 16)
          : ''
      };
      
      setFormData(formattedData);
    } catch (error) {
      toast.error('Failed to load lead data');
      navigate('/leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!formData.source) {
      toast.error('Source is required');
      return false;
    }
    
    if (!formData.status) {
      toast.error('Status is required');
      return false;
    }

    if (formData.score < 0 || formData.score > 100) {
      toast.error('Score must be between 0 and 100');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        score: Number(formData.score),
        lead_value: Number(formData.lead_value),
        last_activity_at: formData.last_activity_at || null
      };

      if (isEdit) {
        await leadService.updateLead(id, submitData);
        toast.success('Lead updated successfully!');
      } else {
        await leadService.createLead(submitData);
        toast.success('Lead created successfully!');
      }
      
      navigate('/leads');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} lead`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading lead data..." />;
  }

  return (
    <div className="lead-form-container">
      <div className="lead-form-header">
        <h2>{isEdit ? 'Edit Lead' : 'Create New Lead'}</h2>
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="btn btn-outline"
        >
          Back to Leads
        </button>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-grid">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="form-section">
            <h3>Company Information</h3>
            
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="form-section">
            <h3>Lead Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="source">Source *</label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  {LEAD_SOURCES.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {LEAD_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="score">Score (0-100)</label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="Enter lead score"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead_value">Lead Value ($)</label>
                <input
                  type="number"
                  id="lead_value"
                  name="lead_value"
                  value={formData.lead_value}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter lead value"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_activity_at">Last Activity</label>
              <input
                type="datetime-local"
                id="last_activity_at"
                name="last_activity_at"
                value={formData.last_activity_at}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_qualified"
                  checked={formData.is_qualified}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Is Qualified Lead
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              isEdit ? 'Update Lead' : 'Create Lead'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;