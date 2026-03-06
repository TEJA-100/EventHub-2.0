"use client";

import { useEffect, useState } from "react";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Analytics = {
    eventId: string;
    eventName: string;
    college: string;
    totalRegistrations: number;
    registrationsByCollege: Record<string, number>;
};

export default function AdminAnalytics() {
    const [data, setData] = useState<Analytics[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/college/analytics")
            .then(res => res.json())
            .then(json => {
                if (json.analytics && Array.isArray(json.analytics)) {
                    setData(json.analytics);
                } else {
                    setData([]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-muted">Loading analytics...</p>;

    // Pie chart – registrations per event
    const pieData = {
        labels: data.map(d => d.eventName),
        datasets: [
            {
                data: data.map(d => d.totalRegistrations),
                backgroundColor: [
                    "#6366f1",
                    "#ec4899",
                    "#f59e0b",
                    "#10b981",
                    "#3b82f6",
                    "#8b5cf6",
                ],
            },
        ],
    };

    // Bar chart – registrations per college (aggregated)
    const collegeMap: Record<string, number> = {};
    data.forEach(d => {
        Object.entries(d.registrationsByCollege).forEach(([col, cnt]) => {
            collegeMap[col] = (collegeMap[col] || 0) + cnt;
        });
    });
    const barData = {
        labels: Object.keys(collegeMap),
        datasets: [
            {
                label: "Registrations per College",
                data: Object.values(collegeMap),
                backgroundColor: "#10b981",
            },
        ],
    };

    const downloadCsv = () => {
        window.open("/api/college/analytics?export=csv", "_blank");
    };

    return (
        <section className="glass-panel" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)', fontWeight: 600 }}>Analytics Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Registrations per Event</h3>
                    <Pie data={pieData} />
                </div>

                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Registrations per College</h3>
                    <Bar data={barData} />
                </div>
            </div>

            <button onClick={downloadCsv} className="btn-primary" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}>
                Download Excel (CSV)
            </button>
        </section>
    );
}
