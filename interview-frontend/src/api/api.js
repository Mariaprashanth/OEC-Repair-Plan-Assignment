
const api_url = "http://localhost:10010";

// Create a new Repair Plan
export const startPlan = async () => {
    const url = `${api_url}/Plan`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) throw new Error("Failed to create plan");

    return await response.json();
};

// Add a procedure to a Repair Plan
export const addProcedureToPlan = async (planId, procedureId) => {
    const url = `${api_url}/Plan/AddProcedureToPlan`;

    const command = {
        planId: planId,
        procedureId: procedureId,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });

    if (!response.ok) throw new Error("Failed to add procedure to plan");

    return true;
};

// Get all procedures
export const getProcedures = async () => {
    const url = `${api_url}/Procedures`;

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get procedures");

    return await response.json();
};

// Get procedures added to a specific plan
export const getPlanProcedures = async (planId) => {
    const url = `${api_url}/PlanProcedure?$filter=planId eq ${planId}&$expand=procedure`;

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get plan procedures");

    return await response.json();
};

// Get all users
export const getUsers = async () => {
    const url = `${api_url}/Users`;

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get users");

    return await response.json();
};

// Get users assigned to a procedure
export const getAssignedUsers = async (planId, procedureId) => {
    const url = `${api_url}/PlanProcedure/${planId}/${procedureId}/users`;

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get assigned users");

    return await response.json();
};

// Assign or update users for a procedure
export const assignUsers = async (planId, procedureId, userIds) => {
    const url = `${api_url}/PlanProcedure/${planId}/${procedureId}/users`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userIds),
    });

    if (!response.ok) throw new Error("Failed to assign users");

    return await response.json();
};

// Remove one assigned user
export const removeUser = async (planId, procedureId, userId) => {
    const url = `${api_url}/PlanProcedure/${planId}/${procedureId}/users/${userId}`;

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to remove user");

    return await response.json();
};

// Remove all assigned users from a procedure
export const removeAllUsers = async (planId, procedureId) => {
    const url = `${api_url}/PlanProcedure/${planId}/${procedureId}/users`;

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to remove all users");

    return await response.json();
};
