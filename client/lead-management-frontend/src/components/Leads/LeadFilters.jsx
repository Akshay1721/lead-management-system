import React, { useState } from 'react';
import { LEAD_SOURCES, LEAD_STATUSES, FILTER_OPERATORS } from '../../utils/constants';

const LeadFilters = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, operator, value) => {
    const newFilters = {
      ...filters,
      [field]: { operator, value }
    };
    
    // Remove filter if value is empty
    if (!value) {
      delete newFilters[field];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const getFilterValue = (field) => {
    return filters[field]?.value || '';
  };

  const getFilterOperator = (field) => {
    return filters[field]?.operator || 'eq';
  };

  return (
    <div className="lead-filters">
      <div className="filters-header">
        <button
          className="btn btn-outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {Object.keys(filters).length > 0 && (
          <button className="btn btn-secondary" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Email Filter */}
            <div className="filter-group">
              <label>Email</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('email')}
                  onChange={(e) => handleFilterChange('email', e.target.value, getFilterValue('email'))}
                >
                  {FILTER_OPERATORS.STRING.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={getFilterValue('email')}
                  onChange={(e) => handleFilterChange('email', getFilterOperator('email'), e.target.value)}
                  placeholder="Enter email..."
                />
              </div>
            </div>

            {/* Company Filter */}
            <div className="filter-group">
              <label>Company</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('company')}
                  onChange={(e) => handleFilterChange('company', e.target.value, getFilterValue('company'))}
                >
                  {FILTER_OPERATORS.STRING.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={getFilterValue('company')}
                  onChange={(e) => handleFilterChange('company', getFilterOperator('company'), e.target.value)}
                  placeholder="Enter company..."
                />
              </div>
            </div>

            {/* City Filter */}
            <div className="filter-group">
              <label>City</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('city')}
                  onChange={(e) => handleFilterChange('city', e.target.value, getFilterValue('city'))}
                >
                  {FILTER_OPERATORS.STRING.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={getFilterValue('city')}
                  onChange={(e) => handleFilterChange('city', getFilterOperator('city'), e.target.value)}
                  placeholder="Enter city..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('status')}
                  onChange={(e) => handleFilterChange('status', e.target.value, getFilterValue('status'))}
                >
                  {FILTER_OPERATORS.ENUM.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <select
                  value={getFilterValue('status')}
                  onChange={(e) => handleFilterChange('status', getFilterOperator('status'), e.target.value)}
                >
                  <option value="">Select status...</option>
                  {LEAD_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source Filter */}
            <div className="filter-group">
              <label>Source</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('source')}
                  onChange={(e) => handleFilterChange('source', e.target.value, getFilterValue('source'))}
                >
                  {FILTER_OPERATORS.ENUM.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <select
                  value={getFilterValue('source')}
                  onChange={(e) => handleFilterChange('source', getFilterOperator('source'), e.target.value)}
                >
                  <option value="">Select source...</option>
                  {LEAD_SOURCES.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score Filter */}
            <div className="filter-group">
              <label>Score</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('score')}
                  onChange={(e) => handleFilterChange('score', e.target.value, getFilterValue('score'))}
                >
                  {FILTER_OPERATORS.NUMBER.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={getFilterValue('score')}
                  onChange={(e) => handleFilterChange('score', getFilterOperator('score'), e.target.value)}
                  placeholder="Enter score..."
                />
              </div>
            </div>

            {/* Is Qualified Filter */}
            <div className="filter-group">
              <label>Qualified</label>
              <div className="filter-controls">
                <select
                  value={getFilterOperator('is_qualified')}
                  onChange={(e) => handleFilterChange('is_qualified', e.target.value, getFilterValue('is_qualified'))}
                >
                  {FILTER_OPERATORS.BOOLEAN.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <select
                  value={getFilterValue('is_qualified')}
                  onChange={(e) => handleFilterChange('is_qualified', getFilterOperator('is_qualified'), e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFilters;