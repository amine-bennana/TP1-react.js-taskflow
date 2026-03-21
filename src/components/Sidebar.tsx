import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRenameProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRenameProject, onDeleteProject }: SidebarProps) {

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed
        }`}
    >
      <h2 className={styles.title}>
        Mes Projets
      </h2>

      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.listItem}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <div className={styles.itemContent}>
                <span
                  className={styles.dot}
                  style={{ background: p.color }}
                />
                <span className={styles.projectName}>{p.name}</span>
              </div>
            </NavLink>
            <div className={styles.actions}>
              {onRenameProject && (
                <button
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRenameProject(p);
                  }}
                  title="Renommer"
                >
                  ✏️
                </button>
              )}
              {onDeleteProject && (
                <button
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteProject(p.id);
                  }}
                  title="Supprimer"
                >
                  🗑️
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}