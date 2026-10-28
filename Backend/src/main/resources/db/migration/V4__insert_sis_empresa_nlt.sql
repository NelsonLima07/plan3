-- Inserir empresa NLT caso não exista
INSERT INTO sis_empresa (nome_empresa)
SELECT 'NLT'
WHERE NOT EXISTS (SELECT 1 FROM sis_empresa WHERE nome_empresa = 'NLT');
