
const api_url = "http://localhost:10010";

// Reusable API request helper
const apiRequest = async (endpoint, options = {}, errorMessage) => {
    const response = await fetch(`${api_url}${endpoint}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body && { "Content-Type": "application/json" }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    // Handle responses without a body
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    return null;
};

// Create a new Repair Plan
export const startPlan = () =>
    apiRequest(
        "/Plan",
        {
            method: "POST",
            body: JSON.stringify({}),
        },
        "Failed to create plan"
    );

// Add a procedure to a Repair Plan
export const addProcedureToPlan = (planId, procedureId) =>
    apiRequest(
        "/Plan/AddProcedureToPlan",
        {
            method: "POST",
            body: JSON.stringify({ planId, procedureId }),
        },
        "Failed to add procedure to plan"
    ).then(() => true);

// Get all procedures
export const getProcedures = () =>
    apiRequest("/Procedures", {}, "Failed to get procedures");

// Get procedures added to a specific plan
export const getPlanProcedures = (planId) =>
    apiRequest(
        `/PlanProcedure?$filter=planId eq ${planId}&$expand=procedure`,
        {},
        "Failed to get plan procedures"
    );

// Get all users
export const getUsers = () =>
    apiRequest("/Users", {}, "Failed to get users");

// Get users assigned to a procedure
export const getAssignedUsers = (planId, procedureId) =>
    apiRequest(
        `/PlanProcedure/${planId}/${procedureId}/users`,
        {},
        "Failed to get assigned users"
    );

// Assign or update users for a procedure
export const assignUsers = (planId, procedureId, userIds) =>
    apiRequest(
        `/PlanProcedure/${planId}/${procedureId}/users`,
        {
            method: "PUT",
            body: JSON.stringify(userIds),
        },
        "Failed to assign users"
    );

// Remove one assigned user
export const removeUser = (planId, procedureId, userId) =>
    apiRequest(
        `/PlanProcedure/${planId}/${procedureId}/users/${userId}`,
        { method: "DELETE" },
        "Failed to remove user"
    );

// Remove all assigned users from a procedure
export const removeAllUsers = (planId, procedureId) =>
    apiRequest(
        `/PlanProcedure/${planId}/${procedureId}/users`,
        { method: "DELETE" },
        "Failed to remove all users"
    );
