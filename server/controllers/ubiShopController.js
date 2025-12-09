import ValuationModel from "../models/ubiShopModel.js";

export const createValuation = async (req, res) => {
    try {
        const { clientId, uniqueId, username, userRole } = req.body;
        const authenticatedUser = req.user?.username;
        const authenticatedRole = req.user?.role;
        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }
        if (!clientId || !uniqueId || !username) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: clientId, uniqueId, username"
            });
        }
        const existingValuation = await ValuationModel.findOne({
            clientId,
            uniqueId
        });
        if (existingValuation) {
            return res.status(200).json({
                success: true,
                message: "Valuation already exists (duplicate submission prevented)",
                data: existingValuation,
                isDuplicate: true
            });
        }

        // Data validation skipped

        const newValuation = new ValuationModel({
            clientId,
            uniqueId,
            username,
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole || "user",
            status: "pending",
            dateTime: new Date().toLocaleString(),
            day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
            ...req.body
        });

        const savedValuation = await newValuation.save();

        res.status(201).json({
            success: true,
            message: "Valuation created successfully",
            data: savedValuation
        });
    } catch (error) {
        console.error("Create Valuation Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create valuation",
            error: error.message
        });
    }
};


export const getValuationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }
        let valuation;
        try {
            valuation = await ValuationModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!valuation) {
            return res.status(404).json({
                success: false,
                message: "Valuation not found"
            });
        }
        if (valuation.clientId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }
        if (userRole !== "manager" && userRole !== "admin" && valuation.username !== username) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this valuation"
            });
        }

        res.status(200).json({
            success: true,
            data: valuation
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch valuation",
            error: error.message
        });
    }
};


export const getAllValuations = async (req, res) => {
    try {
        const { username, userRole, clientId, status, city, bankName, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }
        filter.clientId = clientId;
        if (userRole !== "manager" && userRole !== "admin") {
            filter.username = username;
        }        if (status) filter.status = status;
        if (city) filter.city = city;
        if (bankName) filter.bankName = bankName;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const valuations = await ValuationModel.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();
        const total = await ValuationModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: valuations,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
                }
                });
                } catch (error) {
                res.status(500).json({
            success: false,
            message: "Failed to fetch valuations",
            error: error.message
        });
    }
};

export const updateValuation = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[updateValuation] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Validate required query parameters
        if (!username || !userRole || !clientId) {
            console.error("[updateValuation] Missing required parameters:", {
                hasUsername: !!username,
                hasUserRole: !!userRole,
                hasClientId: !!clientId
            });
            return res.status(400).json({
                success: false,
                message: "Missing required user information"
            });
        }

        console.log("[updateValuation] Request received:", {
            id,
            username,
            userRole,
            action: "save changes",
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Fetch existing valuation
        let valuation;
        try {
            valuation = await ValuationModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            console.error("[updateValuation] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!valuation) {
            console.error("[updateValuation] Valuation not found:", id);
            return res.status(404).json({
                success: false,
                message: "Valuation not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (valuation.clientId !== clientId) {
            console.error("[updateValuation] Client isolation violation:", {
                recordClient: valuation.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Permission check: User can only update their own pending/rejected/rework forms
        if (userRole !== "manager" && userRole !== "admin" && valuation.username !== username) {
            console.error("[updateValuation] User trying to update someone else's form:", {
                owner: valuation.username,
                requester: username
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this valuation"
            });
        }

        // Status validation: Regular users cannot edit certain statuses
        if (userRole !== "manager" && userRole !== "admin") {
            if (!["pending", "rejected", "rework"].includes(valuation.status)) {
                console.error("[updateValuation] User cannot edit status:", valuation.status);
                return res.status(400).json({
                    success: false,
                    message: `Cannot edit valuation with status: ${valuation.status}`
                });
            }
        }

        console.log("[updateValuation] Permission check passed. Previous status:", valuation.status);

        // Prepare update data with proper field handling
        // IMPORTANT: Server always sets status to "on-progress" on save
        const updateData = {
            ...req.body,
            status: "on-progress",
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole,
            lastUpdatedAt: new Date(),
            updatedAt: new Date()
        };

        // Remove sensitive fields if user is trying to set them directly
        if (userRole !== "admin") {
            delete updateData.managerFeedback;
            delete updateData.submittedByManager;
        }

        const updatedValuation = await ValuationModel.findOneAndUpdate(
            { uniqueId: String(id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedValuation) {
            console.error("[updateValuation] Failed to update valuation:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update valuation"
            });
        }

        console.log("[updateValuation] Success:", {
            valuationId: id,
            newStatus: updatedValuation.status,
            updatedAt: updatedValuation.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: "Valuation updated successfully",
            data: updatedValuation
        });
    } catch (error) {
        console.error("[updateValuation] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update valuation",
            error: error.message
        });
    }
};



export const managerSubmit = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID is not empty
        if (!id || typeof id !== 'string') {
            console.error("[managerSubmit] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Use req.user from middleware (already authenticated), fall back to body if provided
        let action = req.body.action || req.body.status;
        const feedback = req.body.feedback || req.body.managerFeedback || "";
        const username = req.body.username || req.user.username;
        const userRole = req.body.userRole || req.user.role;
        const clientId = req.body.clientId || req.user.clientId;

        console.log("[managerSubmit] Request received:", {
            id,
            action,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            console.error("[managerSubmit] Unauthorized role:", req.user.role);
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can perform this action"
            });
        }

        // Validate action
        if (!["approved", "rejected"].includes(action)) {
            console.error("[managerSubmit] Invalid action:", action);
            return res.status(400).json({
                success: false,
                message: "Invalid action. Must be 'approved' or 'rejected'"
            });
        }

        // Find valuation by uniqueId (explicitly as string, not ObjectId)
        let valuation;
        try {
            valuation = await ValuationModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            console.error("[managerSubmit] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters",
                error: "Failed to query valuation"
            });
        }

        if (!valuation) {
            console.error("[managerSubmit] Valuation not found:", id);
            return res.status(404).json({
                success: false,
                message: "Valuation not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (valuation.clientId !== clientId) {
            console.error("[managerSubmit] Client isolation violation:", {
                recordClient: valuation.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Log the action being performed
        console.log("[managerSubmit] Performing action:", {
            action,
            valuationId: id,
            previousStatus: valuation.status,
            hashedFeedback: feedback ? feedback.substring(0, 20) + "..." : "(empty)"
        });

        // Update valuation status by uniqueId (explicitly use String ID)
        const updatedValuation = await ValuationModel.findOneAndUpdate(
            { uniqueId: String(id) },
            {
                status: action,
                managerFeedback: feedback.trim() || "",
                submittedByManager: true,
                lastUpdatedBy: username,
                lastUpdatedByRole: userRole,
                lastUpdatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedValuation) {
            console.error("[managerSubmit] Failed to update valuation:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update valuation"
            });
        }

        console.log("[managerSubmit] Success:", {
            action,
            newStatus: updatedValuation.status,
            updatedAt: updatedValuation.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: `Valuation ${action} successfully`,
            data: updatedValuation
        });
    } catch (error) {
        // Handle Mongoose validation/casting errors more gracefully
        console.error("[managerSubmit] Unexpected error:", error);
        let errorMessage = "Failed to submit valuation";
        if (error.name === 'MongooseError' || error.message.includes('Cast to')) {
            errorMessage = "Invalid valuation format or ID";
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.name === 'CastError' ? "Invalid data format" : error.message
        });
    }
};


export const requestRework = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Use req.user from middleware (already authenticated), fall back to body if provided
        const comments = req.body.comments || "";
        const username = req.body.username || req.user.username;
        const userRole = req.body.userRole || req.user.role;
        const clientId = req.body.clientId || req.user.clientId;

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can request rework"
            });
        }

        // Find valuation by uniqueId (explicitly as string, not ObjectId)
        let valuation;
        try {
            valuation = await ValuationModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters",
                error: "Failed to query valuation"
            });
        }

        if (!valuation) {
            return res.status(404).json({
                success: false,
                message: "Valuation not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (valuation.clientId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Update valuation for rework by uniqueId (explicitly use String ID)
        const updatedValuation = await ValuationModel.findOneAndUpdate(
            { uniqueId: String(id) },
            {
                status: "rework",
                reworkComments: comments || "",
                reworkRequestedBy: username,
                reworkRequestedAt: new Date(),
                reworkRequestedByRole: userRole,
                lastUpdatedBy: username,
                lastUpdatedByRole: userRole,
                lastUpdatedAt: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Rework requested successfully",
            data: updatedValuation
            });
            } catch (error) {
            res.status(500).json({
            success: false,
            message: "Failed to request rework",
            error: error.message
        });
    }
};

