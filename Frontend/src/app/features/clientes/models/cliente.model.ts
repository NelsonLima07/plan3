export interface SisEmpresa {
  id: number;
  datacadastro?: string;
  horacadastro?: string;
  nomeEmpresa: string;
}

export interface Cliente {
  id?: number;
  datacadastro?: string;
  horacadastro?: string;
  deleteAt?: string | null;
  updateAt?: string | null;
  idEmpresa: number;
  tipoPessoa: 'F' | 'J';
  nomePessoa: string;
  cpfCnpj: string | null;
  empresa?: SisEmpresa;
}
