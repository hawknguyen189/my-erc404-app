import React from "react";

const FleetManager = () => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Fleet Manager</h5>
        <p className="card-text">
          Coming soon: Manage your fleets with ERC-404 assets.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Fleet ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetManager;
