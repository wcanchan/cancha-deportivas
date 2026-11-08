-- Insertar canchas de ejemplo
INSERT INTO canchas (name, localidad, descripcion, direccion, latitude, longitude, telefono, capacidad, precio_por_hora, amenidades, disponible)
VALUES
  (
    'Cancha Premium Centro',
    'Centro',
    'Cancha de grama sintética de alta calidad con luces LED profesionales. Perfecta para partidos competitivos.',
    'Calle Principal 123, Centro',
    -33.8688,
    -51.2093,
    '+56 9 1234 5678',
    14,
    25000.00,
    ARRAY['Grama sintética', 'Luces LED', 'Estacionamiento', 'Camerinos', 'Ducha'],
    true
  ),
  (
    'Cancha Las Condes',
    'Las Condes',
    'Cancha moderna en zona residencial con todas las comodidades.',
    'Avenida Las Condes 456',
    -33.3882,
    -70.5695,
    '+56 9 2345 6789',
    14,
    20000.00,
    ARRAY['Grama sintética', 'Estacionamiento', 'Camerinos'],
    true
  ),
  (
    'Cancha Ñuñoa Express',
    'Ñuñoa',
    'Cancha rápida sin trámites. Ideal para partidos casuales.',
    'Calle Los Ingleses 789, Ñuñoa',
    -33.4169,
    -70.5897,
    '+56 9 3456 7890',
    14,
    18000.00,
    ARRAY['Grama natural', 'Luces LED', 'Estacionamiento'],
    true
  ),
  (
    'Cancha Providencia VIP',
    'Providencia',
    'Instalaciones premium con servicios adicionales incluidos.',
    'Avenida Providencia 321, Providencia',
    -33.4272,
    -70.6156,
    '+56 9 4567 8901',
    14,
    30000.00,
    ARRAY['Grama sintética', 'Luces LED profesionales', 'Estacionamiento', 'Camerinos', 'Ducha', 'Snack bar'],
    true
  ),
  (
    'Cancha Vitacura',
    'Vitacura',
    'Cancha en zona norte, moderna y bien equipada.',
    'Calle Vitacura 555, Vitacura',
    -33.3893,
    -70.6169,
    '+56 9 5678 9012',
    14,
    22000.00,
    ARRAY['Grama sintética', 'Luces LED', 'Estacionamiento', 'Camerinos'],
    true
  ),
  (
    'Cancha Maipú',
    'Maipú',
    'Cancha accesible en zona poniente con buenas conexiones.',
    'Avenida Central 999, Maipú',
    -33.4331,
    -70.7541,
    '+56 9 6789 0123',
    14,
    16000.00,
    ARRAY['Grama natural', 'Luces LED', 'Estacionamiento'],
    true
  );

-- Insertar horarios disponibles (ejemplo para algunas canchas)
INSERT INTO horarios_disponibles (cancha_id, dia_semana, hora_inicio, hora_fin, disponible)
VALUES
  -- Cancha Premium Centro - Todos los días
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Lunes', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Martes', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Miércoles', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Jueves', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Viernes', '18:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Sábado', '09:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Premium Centro'), 'Domingo', '09:00', '21:00', true),

  -- Cancha Las Condes
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Lunes', '19:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Martes', '19:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Miércoles', '19:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Jueves', '19:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Viernes', '19:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Sábado', '10:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Las Condes'), 'Domingo', '10:00', '20:00', true),

  -- Cancha Ñuñoa Express
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Lunes', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Martes', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Miércoles', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Jueves', '18:00', '22:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Viernes', '18:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Sábado', '08:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Ñuñoa Express'), 'Domingo', '08:00', '21:00', true),

  -- Cancha Providencia VIP
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Lunes', '17:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Martes', '17:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Miércoles', '17:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Jueves', '17:00', '23:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Viernes', '17:00', '00:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Sábado', '08:00', '00:00', true),
  ((SELECT id FROM canchas WHERE name = 'Cancha Providencia VIP'), 'Domingo', '08:00', '22:00', true);
