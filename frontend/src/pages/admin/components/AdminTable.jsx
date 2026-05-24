import React from 'react';

const AdminTable = ({ columns, rows, emptyText, renderRowActions }) => {
  return (
    
    <div className="admin-table-wrapper">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #00695c 0%, #00897b 100%)' }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.thClassName || 'py-3 border-0'}
                  style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
                >
                  {c.label}
                </th>
              ))}
              {renderRowActions && (
                <th className="py-3 border-0 text-end px-4"
                  style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows?.length ? (
              rows.map((row) => (
                <tr
                  key={
                    row.employerID ||
                    row.programID ||
                    row.enrollmentID ||
                    row.username ||
                    JSON.stringify(row)
                  }
                  className="employer-row"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={c.tdClassName || 'py-3 border-0'}
                    >
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}

                  {renderRowActions && (
                    <td
                      className="py-3 border-0 text-end px-4"
                      style={{ width: 260 }}
                    >
                      {renderRowActions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className="text-center py-5 text-muted"
                >
                  {emptyText || 'No data available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;