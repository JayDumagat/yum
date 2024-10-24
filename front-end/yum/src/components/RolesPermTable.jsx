import { useState } from "react";

const RolesPermTable = () => {
  // Define initial roles
  const [roles, setRoles] = useState([
    { id: 1, name: "Product Specialist" },
    { id: 2, name: "Head of Product" },
  ]);

  // Permissions data
  const allPermissions = [
    { id: 1, name: "View Companies" },
    { id: 2, name: "Edit Companies List" },
    { id: 3, name: "Edit Station Point" },
    { id: 4, name: "View Passengers" },
    { id: 5, name: "Edit Passenger List" },
    { id: 6, name: "View Billing" },
    { id: 7, name: "Edit Billing" },
  ];

  // State for filtered permissions and search query
  const [searchQuery, setSearchQuery] = useState("");
  const [permissions, setPermissions] = useState(allPermissions);

  // State to track permissions for each role
  const [permissionsByRole, setPermissionsByRole] = useState(
    roles.reduce((acc, role) => {
      acc[role.id] = allPermissions.map(() => false); // initialize all permissions as false (unchecked)
      return acc;
    }, {})
  );

  // Handler for toggling permission
  const handlePermissionChange = (roleId, permissionIndex) => {
    setPermissionsByRole((prevPermissions) => ({
      ...prevPermissions,
      [roleId]: prevPermissions[roleId].map((perm, index) =>
        index === permissionIndex ? !perm : perm
      ),
    }));
  };

  // Handler to add a new role
  const addRole = () => {
    const newRoleId = roles.length + 1;
    setRoles([...roles, { id: newRoleId, name: `Role ${newRoleId}` }]);
    setPermissionsByRole({
      ...permissionsByRole,
      [newRoleId]: allPermissions.map(() => false),
    });
  };

  // Handler to update role name
  const handleRoleNameChange = (roleId, newName) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, name: newName } : role
      )
    );
  };

  // Handler to filter permissions based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredPermissions = allPermissions.filter((permission) =>
      permission.name.toLowerCase().includes(query)
    );
    setPermissions(filteredPermissions);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Role Permission Matrix</h2>
        <button
          onClick={addRole}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:border-blue-500"
                />
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-4 py-2 border">
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) =>
                      handleRoleNameChange(role.id, e.target.value)
                    }
                    className="text-center p-1 w-full bg-transparent focus:border-gray-300 focus:outline-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, permissionIndex) => (
              <tr key={permission.id} className="border-t">
                <td className="px-4 py-2 border">{permission.name}</td>
                {roles.map((role) => (
                  <td key={role.id} className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={permissionsByRole[role.id][permissionIndex]}
                      onChange={() =>
                        handlePermissionChange(role.id, permissionIndex)
                      }
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPermTable;
