-- Insert Roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access'),
('user', 'Regular user with limited access');

-- Insert Permissions
INSERT INTO permissions (name, description) VALUES
('create', 'Create new resources'),
('read', 'Read resources'),
('update', 'Update existing resources'),
('delete', 'Delete resources'),
('manage_users', 'Manage user accounts'),
('manage_roles', 'Manage roles and permissions');

-- Insert Role-Permission relationships
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- Admin has all permissions
(2, 2),                                            -- User has only read permission
(2, 1);                                            -- User can create

-- Insert Users
INSERT INTO users (username, email, password_hash, bio, role_id, created_at) VALUES
('admin_user', 'admin@example.com', '$2b$10$hashedpassword1', 'Administrator account', 1, NOW()),
('maria_lopez', 'maria@example.com', '$2b$10$hashedpassword2', 'Lover of board games', 2, NOW()),
('camila_diaz', 'camila@example.com', '$2b$10$hashedpassword3', 'Strategic games enthusiast', 2, NOW()),
('gabriel_hernandez', 'gabriel@example.com', '$2b$10$hashedpassword4', 'Party games fan', 2, NOW()),
('paula_gomez', 'paula@example.com', '$2b$10$hashedpassword5', 'Competitive player', 2, NOW()),
('natalia_arias', 'natalia@example.com', '$2b$10$hashedpassword6', 'Game collector', 2, NOW());

-- Insert Games
INSERT INTO games (name, description, min_players, max_players, category, created_by) VALUES
('Chess', 'The classic strategy game of kings', 2, 2, 'strategy', 2),
('Catan', 'Build and trade on an island', 3, 4, 'strategy', 3),
('Carcassonne', 'Build a medieval landscape with tiles', 2, 5, 'abstract', 4),
('Pandemic', 'Cooperatively save the world from diseases', 2, 4, 'cooperative', 5),
('Codenames', 'Guess the secret words through clues', 2, 8, 'party', 6);

-- Insert Sessions
INSERT INTO sessions (game_id, host_id, date_session, status) VALUES
(1, 2, NOW() - INTERVAL '2 days', 'completed'),
(4, 3, NOW() - INTERVAL '1 day', 'completed');

-- Insert Participants
INSERT INTO participants (session_id, user_id, score, position, is_winner) VALUES
(1, 2, 50, 1, true),
(1, 3, 35, 2, false),
(2, 3, 75, 1, true),
(2, 4, 60, 2, false),
(2, 5, 55, 3, false),
(2, 6, 40, 4, false);

-- Insert Comments
INSERT INTO comments (content, user_id, game_id, created_at) VALUES
('Great game! Very strategic and engaging.', 2, 1, NOW() - INTERVAL '2 days'),
('Catan is perfect for game nights with friends!', 3, 2, NOW() - INTERVAL '2 days'),
('Love the tile-placement mechanics in Carcassonne', 4, 3, NOW() - INTERVAL '1 day'),
('Pandemic is an excellent cooperative experience', 5, 4, NOW() - INTERVAL '1 day'),
('Codenames is so much fun with large groups!', 6, 5, NOW() - INTERVAL '12 hours'),
('Chess never gets old', 3, 1, NOW() - INTERVAL '12 hours'),
('Building trade routes in Catan is addictive', 4, 2, NOW() - INTERVAL '6 hours');
