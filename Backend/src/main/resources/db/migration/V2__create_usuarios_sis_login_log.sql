CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    datacadastro DATE DEFAULT CURRENT_DATE,
    horacadastro TIME DEFAULT CURRENT_TIME,
    delete_at TIMESTAMP,
    update_at TIMESTAMP,
    nome VARCHAR(60),
    login VARCHAR(80),
    senha VARCHAR(20)
);

CREATE TABLE sis_login_log (
    id BIGSERIAL PRIMARY KEY,
    datacadastro DATE DEFAULT CURRENT_DATE,
    horacadastro TIME DEFAULT CURRENT_TIME,
    id_login INTEGER,
    token VARCHAR(255)
);
