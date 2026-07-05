import React, { useMemo } from 'react'

export const usePermissions = (role) => {

    // check if Root
    const isRoot = useMemo(() => role?.roleName === "root", [role]);

    // Get actions array for a module
    // const getAllowedActions = (moduleNameOrId) => {
    //     if (!role || !Array.isArray(role.permissions)) return [];

    //     const module = role.permissions.find(
    //         (m) =>
    //             m.module === moduleNameOrId ||
    //             (m.name && m.name.toLowerCase() === moduleNameOrId.toLowerCase())
    //     );

    //     return module?.actions || [];
    // };

    // Check if a specific action is allowed
    // const hasPermission = (moduleNameOrId, actionName) => {
    //     const actions = getAllowedActions(moduleNameOrId);
    //     const action = actions.find((a) => a.name === actionName);
    //     return action ? action.allowed === true : false;
    // };

    return useMemo(
        () => ({
            // getAllowedActions,
            // hasPermission,
        }),
        [role, isRoot]
    );
};
