import Link from 'next/link';

export default function SystemAdminDashboard() {
    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1, display: 'flex', gap: 'var(--space-8)' }}>
            {/* Sidebar Navigation */}
            <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 'var(--space-2)', color: 'var(--color-accent)' }}>
                        The Guardian
                    </div>
                    <Link href="/admin" style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)', color: 'var(--color-text)', fontWeight: 600 }}>
                        Platform Overview
                    </Link>
                    <Link href="#" style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }}>
                        Security Audit
                    </Link>
                    <Link href="#" style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }}>
                        User Management
                    </Link>
                </div>

                <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>System Status</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#10b981', fontWeight: 600 }}>
                        <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                        All Systems Operational
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>Platform Monitoring</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Real-time metrics and verification queues across EventHUB.</p>
                    </div>
                </div>

                {/* System Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Active Institutions</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text)' }}>42</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>+3 this month</div>
                    </div>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Total Students</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text)' }}>14,208</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>+850 this week</div>
                    </div>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Total API Traffic</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text)' }}>2.4M</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Requests / 24h</div>
                    </div>
                </div>

                {/* Verification Queue */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        College Verification Queue
                        <span style={{ fontSize: '0.75rem', background: 'var(--color-accent)', color: 'black', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>2 Pending</span>
                    </h2>

                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Institution Name</th>
                                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Contact Email</th>
                                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Date Applied</th>
                                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Documents</th>
                                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Decision</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>State University - Arts College</td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>admin@stateuni.edu</td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>2 hours ago</td>
                                    <td style={{ padding: 'var(--space-4)' }}><button style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>Review ID</button></td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#10b981', color: 'white', fontWeight: 600 }}>Approve</button>
                                            <button style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>Deny</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>National Institute of Design</td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>events@nid.ac</td>
                                    <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>1 day ago</td>
                                    <td style={{ padding: 'var(--space-4)' }}><button style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>Review ID</button></td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#10b981', color: 'white', fontWeight: 600 }}>Approve</button>
                                            <button style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>Deny</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Security Alerts List */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Recent Security Logs</h2>
                    <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <li style={{ padding: 'var(--space-3)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem' }}>Successful admin login from IP 192.168.1.42</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>10 mins ago</span>
                            </li>
                            <li style={{ padding: 'var(--space-3)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem' }}>New College Registration: State University - Arts College</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>2 hours ago</span>
                            </li>
                            <li style={{ padding: 'var(--space-3)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid var(--color-accent)' }}>
                                <span style={{ fontSize: '0.875rem' }}>Failed login attempt rate limit triggered on node 4</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>5 hours ago</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
