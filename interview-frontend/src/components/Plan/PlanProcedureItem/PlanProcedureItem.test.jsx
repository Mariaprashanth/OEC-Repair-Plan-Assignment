
import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import PlanProcedureItem from "./PlanProcedureItem";

import {
    getAssignedUsers,
    assignUsers,
    removeUser,
    removeAllUsers,
} from "../../../api/api";

jest.mock("../../../api/api");

describe("PlanProcedureItem", () => {
    const procedure = {
        procedureId: 1,
        procedureTitle: "Engine Repair",
    };

    const users = [
        { label: "User One", value: 1 },
        { label: "User Two", value: 2 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getAssignedUsers.mockResolvedValue([]);
    });

    test("renders procedure title", async () => {
        render(
            <PlanProcedureItem
                planId={1}
                procedure={procedure}
                users={users}
            />
        );

        expect(screen.getByText("Engine Repair")).toBeInTheDocument();

        await waitFor(() => {
            expect(getAssignedUsers).toHaveBeenCalledWith(1, 1);
        });
    });

    test("loads assigned users", async () => {
        getAssignedUsers.mockResolvedValue([
            { userId: 1, name: "User One" },
        ]);

        render(
            <PlanProcedureItem
                planId={1}
                procedure={procedure}
                users={users}
            />
        );

        await waitFor(() => {
            expect(getAssignedUsers).toHaveBeenCalledWith(1, 1);
            expect(
                screen.getByRole("button", { name: "Remove" })
            ).toBeInTheDocument();
        });
    });

    test("removes one assigned user", async () => {
        getAssignedUsers.mockResolvedValue([
            { userId: 1, name: "User One" },
            { userId: 2, name: "User Two" },
        ]);

        render(
            <PlanProcedureItem
                planId={1}
                procedure={procedure}
                users={users}
            />
        );

        await waitFor(() => {
            expect(
                screen.getAllByRole("button", { name: "Remove" })
            ).toHaveLength(2);
        });

        fireEvent.click(
            screen.getAllByRole("button", { name: "Remove" })[0]
        );

        await waitFor(() => {
            expect(removeUser).toHaveBeenCalledWith(1, 1, 1);
            expect(
                screen.getAllByRole("button", { name: "Remove" })
            ).toHaveLength(1);
        });
    });

    test("removes all assigned users", async () => {
        getAssignedUsers.mockResolvedValue([
            { userId: 1, name: "User One" },
            { userId: 2, name: "User Two" },
        ]);

        render(
            <PlanProcedureItem
                planId={1}
                procedure={procedure}
                users={users}
            />
        );

        await screen.findByRole("button", {
            name: "Remove All Users",
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Remove All Users",
            })
        );

        await waitFor(() => {
            expect(removeAllUsers).toHaveBeenCalledWith(1, 1);
            expect(
                screen.queryByRole("button", { name: "Remove" })
            ).not.toBeInTheDocument();
        });
    });
});
