import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import api from '../../api/axios';

export default function LoginBS() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from || '/dashboard';

  useEffect(() => {
    if (state.user) {
      navigate(from, { replace: true });
    }
  }, [state.user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const { data: users } = await api.get(`/users?email=${email}`);
      if (users.length === 0 || users[0].password !== password) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' });
        return;
      }
      const { password: _, ...user } = users[0];
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur serveur' });
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f0f0f0' }} fluid>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="p-4 d-flex flex-column gap-3">
          <div className="text-center">
            <Card.Title className="mb-0" style={{ color: '#1B8C3E', fontWeight: 700, fontSize: '2rem' }}>
              TaskFlow
            </Card.Title>
            <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
              Connectez-vous pour continuer
            </p>
          </div>

          {state.error && <Alert variant="danger">{state.error}</Alert>}

          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: '#1B8C3E', borderColor: '#1B8C3E' }}
              disabled={state.loading}
            >
              {state.loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
