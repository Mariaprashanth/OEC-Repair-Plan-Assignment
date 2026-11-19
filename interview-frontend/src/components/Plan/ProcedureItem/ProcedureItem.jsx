
import React from "react";

const ProcedureItem = ({
    procedure,
    handleAddProcedureToPlan,
    planProcedures,
}) => {
    const checkboxId = `procedure-${procedure.procedureId}`;

    const isAdded = planProcedures.some(
        (p) => p.procedureId === procedure.procedureId
    );

    return (
        <div className="py-2">
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={checkboxId}
                    checked={isAdded}
                    onChange={() => handleAddProcedureToPlan(procedure)}
                />

                <label
                    className="form-check-label"
                    htmlFor={checkboxId}
                >
                    {procedure.procedureTitle}
                </label>
            </div>
        </div>
    );
};

export default ProcedureItem;
