import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'react-toastify';
import leadService from '../../services/leadService';
import LeadFilters from './LeadFilters.jsx';

// Status Cell Component
const StatusCell = ({ value }) => {
  const getStatusStyle = (status) => {
    const styles = {
      new: { backgroundColor: '#007bff', color: 'white' },
      contacted: { backgroundColor: '#ffc107', color: 'black' },
      qualified: { backgroundColor: '#28a745', color: 'white' },
      lost: { backgroundColor: '#dc3545', color: 'white' },
      won: { backgroundColor: '#17a2b8', color: 'white' }
    };
    return styles[status] || { backgroundColor: '#6c757d', color: 'white' };
  };

  const style = {
    ...getStatusStyle(value),
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block'
  };

  return <span style={style}>{value}</span>;
};

// Actions Cell Component
const ActionsCell = ({ data, onRefresh }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/leads/edit/${data._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(data._id);
        toast.success('Lead deleted successfully');
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <button 
        onClick={handleEdit}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Edit
      </button>
      <button 
        onClick={handleDelete}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
};

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const navigate = useNavigate();

  // Column Definitions for AG Grid
  const columnDefs = [
    { 
      headerName: 'Name', 
      valueGetter: params => {
        const first = params.data.first_name || '';
        const last = params.data.last_name || '';
        return `${first} ${last}`.trim() || 'N/A';
      },
      sortable: true,
      filter: true,
      width: 150
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      sortable: true, 
      filter: true,
      width: 200
    },
    { 
      headerName: 'Phone', 
      field: 'phone', 
      sortable: true, 
      filter: true,
      width: 150,
      valueFormatter: params => params.value || 'N/A'
    },
    { 
      headerName: 'Company', 
      field: 'company', 
      sortable: true, 
      filter: true,
      width: 150,
      valueFormatter: params => params.value || 'N/A'
    },
    { 
      headerName: 'City', 
      field: 'city', 
      sortable: true, 
      filter: true,
      width: 120,
      valueFormatter: params => params.value || 'N/A'
    },
    { 
      headerName: 'State', 
      field: 'state', 
      sortable: true, 
      filter: true,
      width: 100,
      valueFormatter: params => params.value || 'N/A'
    },
    { 
      headerName: 'Source', 
      field: 'source', 
      sortable: true, 
      filter: true,
      width: 120
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true,
      width: 120,
      cellRenderer: params => <StatusCell value={params.value} />
    },
    { 
      headerName: 'Score', 
      field: 'score', 
      sortable: true, 
      filter: true,
      width: 100,
      valueFormatter: params => `${params.value || 0}%`
    },
    { 
      headerName: 'Lead Value', 
      field: 'lead_value', 
      sortable: true, 
      filter: true,
      width: 130,
      valueFormatter: params => `$${(params.value || 0).toLocaleString()}`
    },
    { 
      headerName: 'Qualified', 
      field: 'is_qualified', 
      sortable: true, 
      filter: true,
      width: 100,
      valueFormatter: params => params.value ? 'Yes' : 'No'
    },
    { 
      headerName: 'Created', 
      field: 'created_at', 
      sortable: true, 
      filter: true,
      width: 120,
      valueFormatter: params => {
        if (!params.value) return 'N/A';
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: params => (
        <ActionsCell 
          data={params.data} 
          onRefresh={() => loadLeads(pagination.page)} 
        />
      ),
      width: 150,
      sortable: false,
      filter: false
    }
  ];

  // Load leads function
  const loadLeads = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      
      // Build filter parameters
      let filterParams = {};
      if (leadService.buildFilterParams && typeof leadService.buildFilterParams === 'function') {
        filterParams = leadService.buildFilterParams(currentFilters);
      }
      
      const params = { 
        page, 
        limit: 20,
        ...filterParams
      };
      
      const response = await leadService.getLeads(params);
      setLeads(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 20,
        total: response.total || 0,
        totalPages: response.totalPages || 1
      });
    } catch (error) {
      toast.error('Failed to load leads');
      console.error('Load leads error:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Load leads on component mount
  useEffect(() => {
    loadLeads();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadLeads(1, newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({});
    loadLeads(1, {});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadLeads(newPage);
    }
  };

  return (
    <div className="leads-list-container" style={{ padding: '20px' }}>
      {/* Header */}
      <div className="leads-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div className="leads-title">
          <h2 style={{ margin: 0, marginBottom: '5px' }}>Leads Management</h2>
          <p style={{ margin: 0, color: '#666' }}>
            Total: {pagination.total} leads
          </p>
        </div>
        
        <div className="leads-actions">
          <button 
            onClick={() => navigate('/leads/new')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Add New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <LeadFilters 
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Loading State */}
      {loading && leads.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          fontSize: '16px',
          color: '#666'
        }}>
          Loading leads...
        </div>
      ) : (
        <>
          {/* Data Grid */}
          <div 
            className="ag-theme-alpine" 
            style={{ height: '500px', width: '100%', marginBottom: '20px' }}
          >
            <AgGridReact
              rowData={leads}
              columnDefs={columnDefs}
              animateRows={true}
              domLayout="normal"
              pagination={false}
              suppressPaginationPanel={true}
              rowHeight={50}
            />
          </div>

          {/* Pagination */}
          <div className="pagination-container" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px 0'
          }}>
            <div className="pagination-info" style={{ color: '#666' }}>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} entries
            </div>
            
            <div className="pagination-controls" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: pagination.page === 1 ? '#f8f9fa' : 'white',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                Previous
              </button>
              
              <span style={{ 
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa'
              }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: pagination.page >= pagination.totalPages ? '#f8f9fa' : 'white',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsList;
