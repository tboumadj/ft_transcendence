
CREATE TABLE utilisateurs(
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255)
);

INSERT INTO utilisateurs (nom, prenom) VALUES
  ('Doe', 'John'),
  ('then', 'Bouma');

