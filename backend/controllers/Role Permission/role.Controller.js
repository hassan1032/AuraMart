import Role from "../../models/Role Permission/role.model.js";
import Module from "../../models/Role Permission/module.model.js";

// ✅ Create Role
export const createRole = async (req, res) => {
    try {
        const { roleName } = req.body;
        if (!roleName || typeof roleName !== "string") {
            return res.status(400).json({ success: false, message: "Valid roleName is required", });
        }
        const normalizedRoleName = roleName.trim().toLowerCase();
        const existingRole = await Role.findOne({ roleName: normalizedRoleName });
        if (existingRole) {
            return res.status(400).json({ success: false, message: "Role with this name already exists", });
        }
        const newRole = new Role({
            roleName: normalizedRoleName,
            permissions: []
        });
        const savedRole = await newRole.save();
        return res.status(201).json({ success: true, message: "Role created successfully", data: savedRole.toObject(), });
    } catch (err) {
        console.error("Create Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while creating role", error: err.message, });
    }
};
// ✅ Get All Roles (with populated module info)
export const getAllRoles = async (req, res) => {
    try {
        let roles = await Role.find();
        roles = roles.sort((a, b) => {
            const aName = a.roleName?.toLowerCase();
            const bName = b.roleName?.toLowerCase();
            if (aName === "root") return -1;
            if (bName === "root") return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        return res.status(200).json({ success: true, message: "Roles fetched successfully", data: roles });
    } catch (err) {
        console.error("Get Roles Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching roles", error: err.message });
    }
};
// ✅ Get Single Role by Id
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id).populate("permissions", "name key group actions");
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        return res.status(200).json({ success: true, message: "Role fetched successfully", data: role });
    } catch (err) {
        console.error("Get Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching role", error: err.message });
    }
};
// ✅ Update Role
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleName } = req.body;
        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        if (roleName) role.roleName = roleName;
        const updatedRole = await role.save();
        return res.status(200).json({ success: true, message: "Role updated successfully", data: updatedRole });
    } catch (err) {
        console.error("Update Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while updating role", error: err.message });
    }
};
// ✅ Delete Role
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);

        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }

        return res.status(200).json({ success: true, message: "Role deleted successfully" });
    } catch (err) {
        console.error("Delete Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting role", error: err.message });
    }
};
// ✅ Update Permission ::
export const updateRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;
        const { permissions } = req.body;
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        for (const perm of permissions) {
            const moduleData = await Module.findById(perm.module).lean();
            if (!moduleData) continue;
            let rolePerm = role.permissions.find(
                (p) => p.module.toString() === perm.module
            );
            if (!rolePerm) {
                role.permissions.push({
                    module: perm.module,
                    name: moduleData.name,
                    isVisible: perm.isVisible ?? false,
                    actions: (perm.actions || []).map(action => ({
                        name: action.name,
                        allowed: action.allowed
                    }))
                });
            } else {
                if (typeof perm.isVisible === "boolean") {
                    rolePerm.isVisible = perm.isVisible;
                }
                for (const action of perm.actions || []) {
                    const foundAction = rolePerm.actions.find((a) => a.name === action.name);
                    if (foundAction) {
                        foundAction.allowed = action.allowed;
                    }
                }
                if (!rolePerm.name || rolePerm.name !== moduleData.name) {
                    rolePerm.name = moduleData.name;
                }
            }
        }
        await role.save();
        role.permissions = role.permissions
            .map((p) => {
                p.actions.sort((a, b) => b.allowed - a.allowed);
                return p;
            })
            .sort((a, b) => b.isVisible - a.isVisible);
        const permissionCount = role.permissions.reduce((count, p) => {
            const allowedActions = p.actions.filter((a) => a.allowed).length;
            return count + allowedActions + (p.isVisible ? 1 : 0);
        }, 0);

        return res.json({ success: true, message: "Role permissions updated successfully", permissionCount, data: role, });
    } catch (err) {
        console.error("Update Role Error:", err);
        return res.status(500).json({ success: false, message: "Server error while updating role", error: err.message, });
    }
};
//  ✅ Get Filter Role ::
export const getFilteredRole = async (req, res) => {
    try {
        const { roleName } = req.query;
        const filter = {};
        if (roleName) {
            filter.roleName = { $regex: roleName, $options: 'i' };
        }
        const Roles = await Role.find(filter);
        if (!Roles || Roles.length === 0) {
            return res.status(200).json({ success: true, message: "No Role Found!", count: 0, data: [] });
        }
        res.status(200).json({ success: true, count: Roles.length, data: Roles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


