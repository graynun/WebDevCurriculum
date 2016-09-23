CREATE DATABASE notepad;
CREATE USER 'notepad_client'@'localhost' IDENTIFIED BY 'notepad_DB';
GRANT ALL ON notepad.* TO 'notepad_client'@'localhost';
	