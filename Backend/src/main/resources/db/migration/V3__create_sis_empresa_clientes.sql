CREATE TABLE IF NOT EXISTS sis_empresa (
    id SERIAL PRIMARY KEY,
    datacadastro DATE DEFAULT CURRENT_DATE,
    horacadastro TIME DEFAULT CURRENT_TIME,
    nome_empresa VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    datacadastro DATE DEFAULT CURRENT_DATE,
    horacadastro TIME DEFAULT CURRENT_TIME,
    delete_at TIMESTAMP,
    update_at TIMESTAMP,
    id_empresa INTEGER NOT NULL,
    tipo_pessoa CHAR(1) NOT NULL,
    nome_pessoa VARCHAR(120) NOT NULL,
    cpf_cnpj VARCHAR(25),
    CONSTRAINT chk_clientes_tipo_pessoa CHECK (tipo_pessoa IN ('F', 'J')),
    CONSTRAINT fk_clientes_sis_empresa FOREIGN KEY (id_empresa) REFERENCES sis_empresa(id)
);

-- Índices sugeridos
CREATE INDEX IF NOT EXISTS idx_clientes_id_empresa ON clientes(id_empresa);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_delete_at ON clientes(delete_at);
