import React from "react";

function AdminDashboard() {
  return (
    <>
      <div className="space-y-6">
        <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-text mb-4">Admin Dashboard</h1>
          <p className="text-secondary-600 mb-6">
            Welcome to your dashboard. Here you can manage all your activities
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
