-- KRATOS Mission Control — Schema inicial (D1)
-- Migration: 0001_initial
-- Data: 2026-05-16

------------------------------------------------------------
-- Tabelas core
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  nome            TEXT NOT NULL CHECK(length(nome) >= 1 AND length(nome) <= 100),
  descricao       TEXT CHECK(length(descricao) <= 1000),
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK(status IN ('active','paused','completed','archived')),
  repo            TEXT CHECK(length(repo) <= 300),
  prioridade      INTEGER NOT NULL DEFAULT 3
                  CHECK(prioridade >= 1 AND prioridade <= 5),
  ultima_atividade TEXT NOT NULL,
  criado_em       TEXT NOT NULL,
  atualizado_em   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id              TEXT PRIMARY KEY,
  projeto_id      TEXT REFERENCES projects(id) ON DELETE SET NULL,
  titulo          TEXT NOT NULL CHECK(length(titulo) >= 1 AND length(titulo) <= 200),
  descricao       TEXT CHECK(length(descricao) <= 2000),
  progresso       INTEGER NOT NULL DEFAULT 0
                  CHECK(progresso >= 0 AND progresso <= 100),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK(status IN ('pending','in_progress','completed','blocked','cancelled')),
  deadline        TEXT,
  criado_em       TEXT NOT NULL,
  atualizado_em   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id              TEXT PRIMARY KEY,
  titulo          TEXT NOT NULL CHECK(length(titulo) >= 1 AND length(titulo) <= 200),
  data            TEXT NOT NULL,
  horario         TEXT,
  tipo            TEXT NOT NULL DEFAULT 'deep_work'
                  CHECK(tipo IN ('deep_work','meeting','review','admin','checkpoint')),
  descricao       TEXT CHECK(length(descricao) <= 2000),
  projeto_id      TEXT REFERENCES projects(id) ON DELETE SET NULL,
  completed       INTEGER NOT NULL DEFAULT 0,
  criado_em       TEXT NOT NULL,
  atualizado_em   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id              TEXT PRIMARY KEY,
  nome            TEXT NOT NULL,
  url             TEXT,
  health          TEXT NOT NULL DEFAULT 'unknown'
                  CHECK(health IN ('live','degraded','offline','unknown')),
  last_checked    TEXT
);

------------------------------------------------------------
-- Índices
------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_checkpoints_projeto ON checkpoints(projeto_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_status   ON checkpoints(status);
CREATE INDEX IF NOT EXISTS idx_appointments_data    ON appointments(data);
CREATE INDEX IF NOT EXISTS idx_appointments_tipo    ON appointments(tipo);
CREATE INDEX IF NOT EXISTS idx_projects_status      ON projects(status);

------------------------------------------------------------
-- Seed data (idempotente — INSERT OR IGNORE)
------------------------------------------------------------

INSERT OR IGNORE INTO projects (id, nome, descricao, status, repo, prioridade, ultima_atividade, criado_em, atualizado_em)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00', 'KRATOS Mission Control', 'Cockpit pessoal de missão', 'active', 'https://github.com/lucastigrereal-dev/kratos-mission-control', 5, datetime('now'), datetime('now'), datetime('now')),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Publisher OS', 'Sistema de produção de conteúdo', 'active', NULL, 4, datetime('now'), datetime('now'), datetime('now')),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'OMNIS', 'Execução de skills e crews', 'active', NULL, 3, datetime('now'), datetime('now'), datetime('now'));

INSERT OR IGNORE INTO checkpoints (id, projeto_id, titulo, descricao, progresso, status, deadline, criado_em, atualizado_em)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00', 'Plano do Crédito 4 aprovado', 'Validação do sandbox concluída antes do build de /contexto', 60, 'in_progress', NULL, datetime('now'), datetime('now')),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Crédito 3 validado no sandbox', 'Agenda validada, pronto para abrir plano do Crédito 4', 100, 'completed', NULL, datetime('now', '-1 hour'), datetime('now', '-30 minutes')),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Microcopy do Mentor revisada', 'Aplicar no painel da /agenda após revisão final', 30, 'pending', datetime('now', '+1 day'), datetime('now', '-2 hours'), datetime('now', '-1 hour'));

INSERT OR IGNORE INTO appointments (id, titulo, data, horario, tipo, descricao, projeto_id, completed, criado_em, atualizado_em)
VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Deep Work · KRATOS', date('now'), '08:00', 'deep_work', 'Foco no cockpit de missão', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a00', 0, datetime('now'), datetime('now')),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Review semanal Publisher OS', date('now'), '14:00', 'review', 'Métricas e ajustes de conteúdo', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 0, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO services (id, nome, url, health, last_checked)
VALUES
  ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KRATOS API', '/api/health', 'live', datetime('now')),
  ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Publisher Core', 'http://localhost:3100/health', 'degraded', datetime('now')),
  ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Akasha (pgvector)', 'http://localhost:5432', 'live', datetime('now')),
  ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Supabase Hotels', NULL, 'offline', datetime('now'));
