
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    addProcedureToPlan,
    getPlanProcedures,
    getProcedures,
    getUsers,
} from "../../api/api";

import Layout from "../Layout/Layout";
import ProcedureItem from "./ProcedureItem/ProcedureItem";
import PlanProcedureItem from "./PlanProcedureItem/PlanProcedureItem";

const Plan = () => {
    const { id } = useParams();

    const [procedures, setProcedures] = useState([]);
    const [planProcedures, setPlanProcedures] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load procedures, plan procedures and users
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [proceduresData, planProceduresData, usersData] =
                    await Promise.all([
                        getProcedures(),
                        getPlanProcedures(id),
                        getUsers(),
                    ]);

                setProcedures(proceduresData);
                setPlanProcedures(planProceduresData);

                setUsers(
                    usersData.map((user) => ({
                        label: user.name,
                        value: user.userId,
                    }))
                );
            } catch (err) {
                console.error("Failed to load plan data:", err);
                setError("Failed to load Repair Plan data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // Add procedure to plan
    const handleAddProcedureToPlan = async (procedure) => {
        const alreadyAdded = planProcedures.some(
            (p) => p.procedureId === procedure.procedureId
        );

        if (alreadyAdded) return;

        try {
            await addProcedureToPlan(id, procedure.procedureId);

            setPlanProcedures((previous) => {
                const exists = previous.some(
                    (p) => p.procedureId === procedure.procedureId
                );

                if (exists) return previous;

                return [
                    ...previous,
                    {
                        planId: Number(id),
                        procedureId: procedure.procedureId,
                        procedure: {
                            procedureId: procedure.procedureId,
                            procedureTitle: procedure.procedureTitle,
                        },
                    },
                ];
            });
        } catch (err) {
            console.error("Failed to add procedure:", err);
            alert("Failed to add procedure to plan.");
        }
    };

    return (
        <Layout>
            <div className="container pt-4">
                {loading ? (
                    <p>Loading Repair Plan...</p>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-center">
                            <h2>OEC Interview Frontend</h2>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <div className="card shadow">
                                    <h5 className="card-header">Repair Plan</h5>

                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h4>Procedures</h4>

                                                {procedures.map((procedure) => (
                                                    <ProcedureItem
                                                        key={procedure.procedureId}
                                                        procedure={procedure}
                                                        handleAddProcedureToPlan={
                                                            handleAddProcedureToPlan
                                                        }
                                                        planProcedures={planProcedures}
                                                    />
                                                ))}
                                            </div>

                                            <div className="col">
                                                <h4>Added to Plan</h4>

                                                {planProcedures.map((item) => (
                                                    <PlanProcedureItem
                                                        key={item.procedure.procedureId}
                                                        planId={id}
                                                        procedure={item.procedure}
                                                        users={users}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Plan;
