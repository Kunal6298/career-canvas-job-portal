import { useEffect, useState } from 'react';
import { getMyApplications } from '../../services/applicationService.js';
export default function MyApplications() { const [items, setItems] = useState([]); useEffect(() => { getMyApplications().then((d) => setItems(d.applications)).catch(() => {}); }, []); return <section><h1>My applications</h1><div className="card-grid">{items.map((a) => <article className="card" key={a.id}><span className="eyebrow">{a.status}</span><h2>{a.title}</h2><p>{a.company_name}</p></article>)}</div>{!items.length && <p>No applications yet.</p>}</section>; }
