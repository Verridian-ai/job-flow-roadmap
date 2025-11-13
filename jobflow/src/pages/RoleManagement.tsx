import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import PermissionGate from "../components/auth/PermissionGate";

interface RoleManagementProps {
  adminId: Id<"users">;
}

export default function RoleManagement({ adminId }: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<"job_seeker" | "coach" | "admin">("job_seeker");

  const roleCapabilities = useQuery(api.rbac.getRoleCapabilities, { role: selectedRole });
  const assignRole = useMutation(api.rbac.assignRole);

  const roles = [
    {
      id: "job_seeker" as const,
      name: "Job Seeker",
      description: "Users looking for job opportunities and career coaching",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "👤",
    },
    {
      id: "coach" as const,
      name: "Career Coach",
      description: "Professionals providing coaching and resume verification services",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "🎓",
    },
    {
      id: "admin" as const,
      name: "Administrator",
      description: "Full platform access with user management capabilities",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: "⚙️",
    },
  ];

  const roleInfo = roles.find((r) => r.id === selectedRole);

  return (
    <PermissionGate userId={adminId} permission="manage_platform">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600 mt-2">
              Manage user roles and permissions across the platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedRole === role.id
                          ? role.color
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{role.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs mt-1 opacity-75">{role.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Role Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 border-b ${roleInfo?.color || "bg-gray-100"}`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{roleInfo?.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold">{roleInfo?.name}</h2>
                      <p className="text-sm opacity-75">{roleInfo?.description}</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>

                  {roleCapabilities?.permissions && roleCapabilities.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleCapabilities.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">
                            {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No permissions defined for this role</p>
                  )}
                </div>

                {/* Capabilities */}
                {roleCapabilities?.capabilities && (
                  <div className="px-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Capabilities</h3>
                    <div className="space-y-3">
                      {Object.entries(roleCapabilities.capabilities).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, " $1").trim().replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              value
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {value ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Comparison */}
                <div className="px-6 pb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Role Information</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {selectedRole === "job_seeker" && (
                        <>
                          <li>• Can create and manage resumes</li>
                          <li>• Can book coaching sessions</li>
                          <li>• Can request resume verification</li>
                          <li>• Can upgrade to Coach role</li>
                        </>
                      )}
                      {selectedRole === "coach" && (
                        <>
                          <li>• Can manage coach profile and availability</li>
                          <li>• Can bid on verification tasks</li>
                          <li>• Can conduct coaching sessions</li>
                          <li>• Can receive payments for services</li>
                        </>
                      )}
                      {selectedRole === "admin" && (
                        <>
                          <li>• Full platform access</li>
                          <li>• Can manage all users and roles</li>
                          <li>• Can view platform analytics</li>
                          <li>• Can moderate content and resolve disputes</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Matrix (Summary) */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Seeker
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coach
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    "Create Resume",
                    "View Coach Directory",
                    "Book Session",
                    "Bid on Tasks",
                    "Manage Coach Profile",
                    "View Analytics",
                    "Manage Platform",
                  ].map((permission) => (
                    <tr key={permission}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={permission.includes("Coach") || permission.includes("Bid") ? "text-green-600" : "text-gray-300"}>
                          {permission.includes("Coach") || permission.includes("Bid") ? "✓" : "−"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-green-600">✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}
