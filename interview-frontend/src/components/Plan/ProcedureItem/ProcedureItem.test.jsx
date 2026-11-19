
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProcedureItem from "./ProcedureItem";

describe("ProcedureItem", () => {
    const procedure = {
        procedureId: 1,
        procedureTitle: "Engine Repair",
    };

    test("renders procedure title", () => {
        render(
            <ProcedureItem
                procedure={procedure}
                planProcedures={[]}
                handleAddProcedureToPlan={jest.fn()}
            />
        );

        expect(screen.getByText("Engine Repair")).toBeInTheDocument();
    });

    test("checkbox is checked when procedure is already added", () => {
        render(
            <ProcedureItem
                procedure={procedure}
                planProcedures={[{ procedureId: 1 }]}
                handleAddProcedureToPlan={jest.fn()}
            />
        );

        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    test("calls handler when checkbox is selected", () => {
        const mockHandler = jest.fn();

        render(
            <ProcedureItem
                procedure={procedure}
                planProcedures={[]}
                handleAddProcedureToPlan={mockHandler}
            />
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(mockHandler).toHaveBeenCalledWith(procedure);
    });
});
