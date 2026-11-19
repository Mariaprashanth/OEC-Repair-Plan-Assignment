
import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

import {
    getAssignedUsers,
    assignUsers,
    removeUser,
    removeAllUsers,
} from "../../../api/api";

const PlanProcedureItem = ({ planId, procedure, users }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load assigned users from database
    useEffect(() => {
        const loadAssignedUsers = async () => {
            try {
                setLoading(true);

                const assignedUsers = await getAssignedUsers(
                    planId,
                    procedure.procedureId
                );

                setSelectedUsers(
                    assignedUsers.map((user) => ({
                        label: user.name,
                        value: user.userId,
                    }))
                );
            } catch (error) {
                console.error("Failed to load assigned users:", error);
                alert("Failed to load assigned users.");
            } finally {
                setLoading(false);
            }
        };

        loadAssignedUsers();
    }, [planId, procedure.procedureId]);

    // Reusable save handler
    const performSave = async (action, errorMessage) => {
        try {
            setSaving(true);
            await action();
        } catch (error) {
            console.error(errorMessage, error);
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Assign or update users
    const handleAssignUserToProcedure = async (selectedOptions) => {
        const updatedUsers = selectedOptions || [];

        await performSave(
            async () => {
                const userIds = updatedUsers.map((user) => user.value);

                await assignUsers(
                    planId,
                    procedure.procedureId,
                    userIds
                );

                setSelectedUsers(updatedUsers);
            },
            "Failed to save user assignments."
        );
    };

    // Remove one user
    const handleRemoveUser = async (userId) => {
        await performSave(
            async () => {
                await removeUser(
                    planId,
                    procedure.procedureId,
                    userId
                );

                setSelectedUsers((previous) =>
                    previous.filter((user) => user.value !== userId)
                );
            },
            "Failed to remove user."
        );
    };

    // Remove all users
    const handleRemoveAllUsers = async () => {
        if (selectedUsers.length === 0) return;

        await performSave(
            async () => {
                await removeAllUsers(planId, procedure.procedureId);
                setSelectedUsers([]);
            },
            "Failed to remove all users."
        );
    };

    return (
        <div className="py-2">
            <div>
                <strong>{procedure.procedureTitle}</strong>
            </div>

            <ReactSelect
                className="mt-2"
                placeholder="Select User to Assign"
                isMulti
                options={users}
                value={selectedUsers}
                onChange={handleAssignUserToProcedure}
                isLoading={loading}
                isDisabled={loading || saving}
            />

            {saving && (
                <small className="text-muted">
                    Saving assignments...
                </small>
            )}

            {selectedUsers.length > 0 && (
                <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="fw-bold">
                            Assigned Users
                        </small>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleRemoveAllUsers}
                            disabled={saving}
                        >
                            Remove All Users
                        </button>
                    </div>

                    {selectedUsers.map((user) => (
                        <div
                            key={user.value}
                            className="d-flex justify-content-between align-items-center border rounded p-2 mt-1"
                        >
                            <span>{user.label}</span>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveUser(user.value)}
                                disabled={saving}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlanProcedureItem;
