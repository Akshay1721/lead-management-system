import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'react-toastify';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';
import leadService from '../../services/leadService';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';

// Simple Cell Renderers
const ActionsRenderer = ({ data, onRefresh }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/leads/edit/${data._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(data._id);
        toast.success('Lead deleted successfully');
        // Call refresh function instead of window.location.reload()
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        onClick={handleEdit}
        style={{
          padding: '4px 8px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Edit
      </button>
      <button 
        onClick={handleDelete}
        style={{
          padding: '4px 8px',
          backgroundColor: '#dc2626',
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Delete
      </button>
    </div>
  );
};

const StatusRenderer = ({ value }) => {
  const status = LEAD_STATUSES.find(s => s.value === value);
  return (
    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
      {status ? status.label : value}
    </span>
  );
};

const SourceRenderer = ({ value }) => {
  const source = LEAD_SOURCES.find(s => s.value === value);
  return (
    <span style={{ fontWeight: '500', color: '#059669' }}>
      {source ? source.label : value}
    </span>
  );
};

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const navigate = useNavigate();

  // Load leads function
  const loadLeads = async (page = 1) => {
    try {
      setLoading(true);
      const response = await leadService.getLeads({ page, limit: 20 });
      setLeads(response.data);
      setPagination(response);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Refresh function for after delete
  const refreshLeads = () => {
    loadLeads(pagination.page);
  };

  // Initial load
  useEffect(() => {
    loadLeads();
  }, []);

  // Complete column definitions with ALL required fields
  const columnDefs = [
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <ActionsRenderer 
          data={params.data}
          onRefresh={refreshLeads}
        />
      ),
      width: 140,
      sortable: false,
      filter: false,
      pinned: 'left'
    },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 140 }, // ← ADDED
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'state', headerName: 'State', width: 100 }, // ← ADDED
    {
      field: 'source', // ← ADDED
      headerName: 'Source',
      width: 120,
      cellRenderer: SourceRenderer
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: StatusRenderer
    },
    { field: 'score', headerName: 'Score', width: 100 },
    {
      field: 'lead_value', // ← ADDED
      headerName: 'Lead Value',
      width: 130,
      cellRenderer: (params) => {
        return params.value ? `$${Number(params.value).toLocaleString()}` : '$0';
      }
    },
    {
      field: 'is_qualified',
      headerName: 'Qualified',
      width: 100,
      cellRenderer: (params) => params.value ? 'Yes' : 'No'
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      cellRenderer: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading leads..." />;
  }

  return (
    <div className="leads-list-container">
      <div className="leads-header">
        <div className="leads-title">
          <h2>Leads Management</h2>
          <p>Total: {pagination.total} leads</p>
        </div>

        <div className="leads-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/leads/new')}
          >
            Add New Lead
          </button>
        </div>
      </div>

      <div className="ag-theme-alpine leads-grid">
        <AgGridReact
          rowData={leads}
          columnDefs={columnDefs}
          animateRows={true}
          domLayout="normal"
        />
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} leads
        </div>

        <div className="pagination-controls">
          <button
            className="btn btn-outline"
            onClick={() => loadLeads(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>

          <span className="pagination-pages">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            className="btn btn-outline"
            onClick={() => loadLeads(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsList;