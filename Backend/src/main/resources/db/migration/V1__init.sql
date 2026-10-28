-- Initial migration
CREATE TABLE IF NOT EXISTS sis_info (
    id BIGSERIAL PRIMARY KEY,
    datacadastro DATE DEFAULT CURRENT_DATE,
    horacadastro TIME DEFAULT CURRENT_TIME,
    sistema VARCHAR(50) DEFAULT 'Plan3',
    versao VARCHAR(20) DEFAULT '1.0.0',
    senha_admin VARCHAR(255) DEFAULT 'admin'
);

INSERT INTO sis_info (sistema, versao, senha_admin)
VALUES ('Plan3', '1.0.0', 'admin');

