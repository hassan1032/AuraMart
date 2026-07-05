import moduleModel from "../../models/Role Permission/module.model.js";
import roleModel from "../../models/Role Permission/role.model.js"

// Create Module
export const createModule = async (req, res) => {
    try {
        const { name, actions } = req.body;
        const existingModule = await moduleModel.findOne({ name: name.trim() });
        if (existingModule) {
            return res.status(400).json({ success: false, message: "Module with this name already exists" });
        }
        let finalActions = [];
        if (actions?.length) {
            finalActions = actions.map(a => ({ name: a, allowed: false }));
        } else if (moduleActionMapping[name]) {
            finalActions = moduleActionMapping[name].map(a => ({ name: a, allowed: false }));
        }
        const newModule = await moduleModel.create({ name, isVisible: false, actions: finalActions, });
        return res.status(201).json({ success: true, message: "Module created successfully", data: newModule, });
    } catch (err) {
        console.error("Create Module Error:", err);
        return res.status(500).json({ success: false, message: "Server error while creating module", error: err.message, });
    }
};
// get all modules
export const getAllModules = async (req, res) => {
    try {
        const modules = await moduleModel.find().sort({ createdAt: -1 }).lean();
        const cleanModules = modules.map(m => ({
            ...m,
            actions: m.actions.map(a => ({
                name: a.name, allowed: a.allowed,
            })),
        }));
        return res.status(200).json({ success: true, message: "Modules fetched successfully", count: cleanModules.length, data: cleanModules, });
    } catch (err) {
        console.error("Get Modules Error:", err);
        return res.status(500).json({ success: false, message: "Server error while fetching modules", error: err.message, });
    }
};
// delete module
export const deleteModule = async (req, res) => {
    try {
        const moduleId = req.params.id;
        await roleModel.updateMany(
            { "permissions.module": moduleId },
            { $pull: { permissions: { module: moduleId } } }
        );
        const deleted = await moduleModel.findByIdAndDelete(moduleId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Module not found", });
        }
        return res.status(200).json({ success: true, message: "Module and related permissions deleted successfully", });

    } catch (err) {
        console.error("Delete Module Error:", err);
        return res.status(500).json({ success: false, message: "Server error while deleting module", error: err.message, });
    }
};
