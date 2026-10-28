import { Injectable, computed, signal } from '@angular/core';
import { PERMISSIONS, WILDCARD_PERMISSION } from './permissions';

export interface AuthUser {
  username: string;
  /** Nome exibido na interface (ex.: "Rafael Borges"). */
  name: string;
  role: string;
  /** Permissões do usuário; `'*'` libera todas. Ver `PERMISSIONS`. */
  permissions: string[];
}

interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

interface MockAccount {
  username: string;
  password: string;
  name: string;
  role: string;
  permissions: string[];
}

/**
 * Contas fixas do mock. Quando o backend estiver disponível, basta trocar o
 * corpo de `login()` por uma chamada HTTP — a interface pública não muda.
 */
const MOCK_ACCOUNTS: readonly MockAccount[] = [
  {
    username: 'admin',
    password: 'admin',
    name: 'Administrador do Portal',
    role: 'Administrador',
    permissions: [WILDCARD_PERMISSION],
  },
  {
    username: 'engenheiro',
    password: 'engenheiro',
    name: 'Rafael Borges',
    role: 'Engenheiro civil',
    permissions: [
      PERMISSIONS.dashboard,
      PERMISSIONS.clientes,
      PERMISSIONS.propostas,
      PERMISSIONS.projetos,
      PERMISSIONS.obras,
      PERMISSIONS.om,
      PERMISSIONS.apps,
    ],
  },
];

const STORAGE_KEY = 'plan3.portal.session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const MOCK_LATENCY_MS = 800;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly permissions = computed(() => this.session()?.user.permissions ?? []);

  /** Valida as credenciais do mock e cria a sessão da aplicação. */
  async login(username: string, password: string): Promise<AuthUser> {
    await this.wait(MOCK_LATENCY_MS);

    const normalized = username.trim().toLowerCase();
    const account = MOCK_ACCOUNTS.find(
      (candidate) => candidate.username === normalized && candidate.password === password,
    );

    if (!account) {
      throw new Error('Usuário ou senha inválidos.');
    }

    const user: AuthUser = {
      username: account.username,
      name: account.name,
      role: account.role,
      permissions: [...account.permissions],
    };

    const session: AuthSession = {
      token: this.createMockToken(user),
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    this.persistSession(session);
    this.session.set(session);

    return user;
  }

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Armazenamento indisponível (modo privado): a sessão em memória já foi limpa.
    }
    this.session.set(null);
  }

  /**
   * Verifica se o usuário logado possui a permissão informada. Sem permissão
   * exigida, qualquer usuário autenticado tem acesso.
   */
  hasPermission(permission?: string): boolean {
    if (!permission) {
      return this.isAuthenticated();
    }

    const granted = this.permissions();
    return granted.includes(WILDCARD_PERMISSION) || granted.includes(permission);
  }

  private restoreSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const session = JSON.parse(raw) as AuthSession;
      const permissions = session?.user?.permissions;

      // Sessões gravadas por versões anteriores não têm permissões: descarta.
      if (!session?.token || !Array.isArray(permissions) || session.expiresAt <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  private persistSession(session: AuthSession): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Sem persistência: mantém apenas a sessão em memória.
    }
  }

  private createMockToken(user: AuthUser): string {
    const payload = btoa(
      JSON.stringify({ sub: user.username, permissions: user.permissions, iat: Date.now() }),
    );
    return `mock.${payload}.signature`;
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
