
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

                const selected = assignedUsers.map((u) => ({
                    label: u.name,
                    value: u.userId,
                }));

                setSelectedUsers(selected);
            } catch (error) {
                console.error("Failed to load assigned users:", error);
                alert("Failed to load assigned users.");
            } finally {
                setLoading(false);
            }
        };

        loadAssignedUsers();
    }, [planId, procedure.procedureId]);

    // Assign or update users
    const handleAssignUserToProcedure = async (selectedOptions) => {
        const updatedUsers = selectedOptions || [];

        try {
            setSaving(true);

            const userIds = updatedUsers.map((u) => u.value);

            await assignUsers(
                planId,
                procedure.procedureId,
                userIds
            );

            setSelectedUsers(updatedUsers);
        } catch (error) {
            console.error("Failed to assign users:", error);
            alert("Failed to save user assignments.");
        } finally {
            setSaving(false);
        }
    };

    // Remove one user
    const handleRemoveUser = async (userId) => {
        try {
            setSaving(true);

            await removeUser(
                planId,
                procedure.procedureId,
                userId
            );

            setSelectedUsers((prev) =>
                prev.filter((u) => u.value !== userId)
            );
        } catch (error) {
            console.error("Failed to remove user:", error);
            alert("Failed to remove user.");
        } finally {
            setSaving(false);
        }
    };

    // Remove all users
    const handleRemoveAllUsers = async () => {
        if (selectedUsers.length === 0) return;

        try {
            setSaving(true);

            await removeAllUsers(
                planId,
                procedure.procedureId
            );

            setSelectedUsers([]);
        } catch (error) {
            console.error("Failed to remove all users:", error);
            alert("Failed to remove all users.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="py-2">
            <div>
                <strong>{procedure.procedureTitle}</strong>
            </div>

            <ReactSelect
                className="mt-2"
                placeholder="Select User to Assign"
                isMulti={true}
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
                                onClick={() =>
                                    handleRemoveUser(user.value)
                                }
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
