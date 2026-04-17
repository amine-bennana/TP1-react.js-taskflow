import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useProjects from '../hooks/useProjects';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';


export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddProject = async (name: string, color: string) => {
    setSaving(true);
    await addProject(name, color);
    setSaving(false);
    setShowForm(false);
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={user?.name}
        onLogout={() => dispatch(logout())}
      />
      
      <div className={styles.body}>
        <Sidebar 
          projects={projects} 
          isOpen={sidebarOpen} 
          onRenameProject={renameProject}
          onDeleteProject={deleteProject}
        />
        
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {error && <div className={styles.error}>{error}</div>}
            
            {!showForm ? (
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name: string, color: string) => handleAddProject(name, color)}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
